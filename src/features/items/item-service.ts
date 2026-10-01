import {
  ItemError,
  ITEM_IMAGE_KEYS,
  LOCAL_USER_ID,
  type CampusItem,
  type CreateItemInput,
  type ItemContent,
  type ItemRepository,
  type UpdateItemInput,
} from './item';
import { isValidDate, localDateString, queryItems, type ItemFilters } from './item-query';

function text(value: unknown, field: string, label: string, required = false): string {
  if (value !== undefined && typeof value !== 'string') {
    throw new ItemError('validation', `${label}格式不正确`, field);
  }
  const result = typeof value === 'string' ? value.trim() : '';
  if (required && !result) {
    throw new ItemError('validation', `请填写${label}`, field);
  }
  return result;
}

function validateContent(input: Partial<ItemContent>, now: number): ItemContent {
  const title = text(input.title, 'title', '物品名称', true);
  const location = text(input.location, 'location', '地点', true);
  const date = text(input.date, 'date', '日期', true);
  const time = text(input.time, 'time', '时间');
  const contact = text(input.contact, 'contact', '联系方式', true);
  if (!isValidDate(date) || date > localDateString(now)) {
    throw new ItemError('validation', '请选择有效的丢失或拾取日期，日期不能晚于今天', 'date');
  }
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new ItemError('validation', '时间应为 24 小时制，例如 18:40', 'time');
  }
  const imageAssetKey = input.imageAssetKey ?? null;
  const imageUri = input.imageUri === null ? null : text(input.imageUri, 'imageUri', '图片地址') || null;
  if (imageAssetKey !== null && !ITEM_IMAGE_KEYS.includes(imageAssetKey)) {
    throw new ItemError('validation', '请选择有效的物品图片', 'imageAssetKey');
  }
  if (imageAssetKey && imageUri) {
    throw new ItemError('validation', '示例图片和本地图片不能同时设置', 'imageUri');
  }
  return {
    title,
    location,
    date,
    time,
    contact,
    locationDetail: text(input.locationDetail, 'locationDetail', '详细地点') || location,
    description: text(input.description, 'description', '物品描述'),
    imageAssetKey,
    imageUri,
  };
}

function validId(id: string): string {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    throw new ItemError('not_found', '未找到该物品信息');
  }
  return id;
}

async function storage<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ItemError) {
      throw error;
    }
    throw new ItemError('storage', '无法读写本地数据，请重试', undefined, { cause: error });
  }
}

export function createItemService(repository: ItemRepository) {
  const currentUserId = LOCAL_USER_ID;
  let mutations: Promise<unknown> = Promise.resolve();

  function mutate<T>(operation: () => Promise<T>): Promise<T> {
    const result = mutations.then(operation);
    mutations = result.catch(() => undefined);
    return result;
  }

  async function getItemById(id: string): Promise<CampusItem | null> {
    return storage(() => repository.find(validId(id)));
  }

  async function ownItem(id: string): Promise<CampusItem> {
    const item = await getItemById(id);
    if (!item) {
      throw new ItemError('not_found', '该信息已被删除或不存在');
    }
    if (item.ownerId !== currentUserId) {
      throw new ItemError('forbidden', '只能操作自己发布的信息');
    }
    return item;
  }

  return {
    currentUserId,
    getItemById,
    async listItems(filters: ItemFilters = {}): Promise<CampusItem[]> {
      return queryItems(await storage(() => repository.list()), filters);
    },
    async listMyItems(): Promise<CampusItem[]> {
      return queryItems(await storage(() => repository.list()), { ownerId: currentUserId });
    },
    async createItem(input: CreateItemInput): Promise<CampusItem> {
      return mutate(async () => {
        if (!input || (input.type !== 'lost' && input.type !== 'found')) {
          throw new ItemError('validation', '请选择寻物或招领', 'type');
        }
        const timestamp = Date.now();
        const content = validateContent(input, timestamp);
        return storage(() => repository.create({
          ...content,
          type: input.type,
          status: 'active',
          ownerId: currentUserId,
          createdAt: timestamp,
          updatedAt: timestamp,
        }));
      });
    },
    async updateItem(id: string, input: UpdateItemInput): Promise<CampusItem> {
      return mutate(async () => {
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
          throw new ItemError('validation', '输入信息格式不正确');
        }
        const existing = await ownItem(id);
        const timestamp = Date.now();
        const content = validateContent({ ...existing, ...input }, timestamp);
        const updated = await storage(() => repository.updateContent(existing.id, currentUserId, content, timestamp));
        if (!updated) {
          throw new ItemError('not_found', '该信息已被删除或不存在');
        }
        return updated;
      });
    },
    async markResolved(id: string): Promise<CampusItem> {
      return mutate(async () => {
        const existing = await ownItem(id);
        if (existing.status === 'resolved') {
          return existing;
        }
        const updated = await storage(() => repository.resolve(existing.id, currentUserId, Date.now()));
        if (!updated) {
          throw new ItemError('not_found', '该信息已被删除或不存在');
        }
        return updated;
      });
    },
    async deleteItem(id: string): Promise<void> {
      return mutate(async () => {
        const existing = await ownItem(id);
        if (!await storage(() => repository.remove(existing.id, currentUserId))) {
          throw new ItemError('not_found', '该信息已被删除或不存在');
        }
      });
    },
  };
}

export type ItemService = ReturnType<typeof createItemService>;
