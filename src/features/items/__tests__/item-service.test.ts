import { createItemService } from '../item-service';
import { ItemError, type CampusItem, type ItemRepository } from '../item';
import { localDateString } from '../item-query';

function makeItem(overrides: Partial<CampusItem> = {}): CampusItem {
  return {
    id: '1',
    type: 'lost',
    status: 'active',
    ownerId: 'local-user',
    createdAt: 1000,
    updatedAt: 1000,
    title: '蓝色校园卡',
    location: '教学楼A栋',
    date: '2024-05-19',
    time: '14:30',
    locationDetail: '教学楼A栋 · 二楼走廊',
    description: '卡面比较新，希望早日找到主人',
    contact: '138 1234 5678',
    imageAssetKey: null,
    imageUri: null,
    ...overrides,
  };
}

function createInMemoryRepository(seed: CampusItem[] = []): ItemRepository & { all(): CampusItem[] } {
  const store = new Map<number, CampusItem>();
  seed.forEach(item => store.set(Number(item.id), item));
  const nextId = seed.length ? Math.max(...seed.map(item => Number(item.id))) + 1 : 1;
  let created = 0;

  // 与 SQLite 仓储保持一致:存储用数字主键,出参统一映射为字符串 id
  const out = (item: CampusItem): CampusItem => ({ ...item, id: String(item.id) });

  return {
    async list() {
      return [...store.values()].map(out);
    },
    async find(id) {
      const item = store.get(Number(id));
      return item ? out(item) : null;
    },
    async create(item) {
      const id = nextId + created;
      created += 1;
      const createdItem = out({ ...item, id: String(id) });
      store.set(id, createdItem);
      return createdItem;
    },
    async updateContent(id, ownerId, content, updatedAt) {
      const existing = store.get(Number(id));
      if (!existing || existing.ownerId !== ownerId) {
        return null;
      }
      const updated = out({ ...existing, ...content, updatedAt });
      store.set(Number(id), updated);
      return updated;
    },
    async resolve(id, ownerId, updatedAt) {
      const existing = store.get(Number(id));
      if (!existing || existing.ownerId !== ownerId) {
        return null;
      }
      const updated = out({ ...existing, status: 'resolved' as const, updatedAt });
      store.set(Number(id), updated);
      return updated;
    },
    async remove(id, ownerId) {
      const existing = store.get(Number(id));
      if (!existing || existing.ownerId !== ownerId) {
        return false;
      }
      return store.delete(Number(id));
    },
    all: () => [...store.values()].map(out),
  };
}

function createInput(overrides: Record<string, unknown> = {}) {
  return {
    type: 'lost' as const,
    title: '黑色双肩包',
    location: '图书馆三楼',
    date: '2024-05-20',
    contact: '139 5678 1234',
    ...overrides,
  };
}

function expectItemError(promise: Promise<unknown>, code: string, field?: string) {
  return expect(promise).rejects.toMatchObject({
    name: 'ItemError',
    code,
    ...(field ? { field } : {}),
  });
}

describe('createItemService createItem', () => {
  it('归一化输入:裁剪空白、locationDetail 缺省取 location、写入归属与状态', async () => {
    const repository = createInMemoryRepository();
    const service = createItemService(repository);

    const item = await service.createItem(createInput({
      type: 'found',
      title: '  蓝色校园卡  ',
      contact: ' 138 1234 5678 ',
    }));

    expect(item.id).toBe('1');
    expect(item.title).toBe('蓝色校园卡');
    expect(item.contact).toBe('138 1234 5678');
    expect(item.locationDetail).toBe('图书馆三楼');
    expect(item.status).toBe('active');
    expect(item.ownerId).toBe('local-user');
    expect(item.createdAt).toBeGreaterThan(0);
    expect(repository.all()).toHaveLength(1);
  });

  it('拒绝合法范围之外的信息类型', async () => {
    const service = createItemService(createInMemoryRepository());
    await expectItemError(
      service.createItem(createInput({ type: 'sale' as never })),
      'validation'
    );
  });

  it('拒绝空白物品名称', async () => {
    const service = createItemService(createInMemoryRepository());
    await expectItemError(
      service.createItem(createInput({ title: '   ' })),
      'validation',
      'title'
    );
  });

  it('拒绝非法日期格式', async () => {
    const service = createItemService(createInMemoryRepository());
    await expectItemError(
      service.createItem(createInput({ date: '2024/05/20' })),
      'validation',
      'date'
    );
  });

  it('拒绝晚于今天的日期', async () => {
    const service = createItemService(createInMemoryRepository());
    const future = localDateString(Date.now() + 86400000);
    await expectItemError(
      service.createItem(createInput({ date: future })),
      'validation',
      'date'
    );
  });

  it('拒绝超出 24 小时制的时间', async () => {
    const service = createItemService(createInMemoryRepository());
    await expectItemError(
      service.createItem(createInput({ time: '25:00' })),
      'validation',
      'time'
    );
  });

  it('拒绝空白联系方式', async () => {
    const service = createItemService(createInMemoryRepository());
    await expectItemError(
      service.createItem(createInput({ contact: '   ' })),
      'validation',
      'contact'
    );
  });

  it('拒绝未知的示例图片标识', async () => {
    const service = createItemService(createInMemoryRepository());
    await expectItemError(
      service.createItem(createInput({ imageAssetKey: 'camera' })),
      'validation',
      'imageAssetKey'
    );
  });

  it('拒绝同时设置示例图片与本地图片', async () => {
    const service = createItemService(createInMemoryRepository());
    await expectItemError(
      service.createItem(createInput({ imageAssetKey: 'keys', imageUri: 'file:///tmp/photo.jpg' })),
      'validation',
      'imageUri'
    );
  });
});

describe('createItemService query and status flows', () => {
  it('按数字 id 查询物品,非数字 id 报 not_found,未命中返回 null', async () => {
    const service = createItemService(createInMemoryRepository([makeItem({ id: '1' })]));

    await expect(service.getItemById('1')).resolves.toMatchObject({ id: '1', title: '蓝色校园卡' });
    await expect(service.getItemById('abc')).rejects.toMatchObject({ code: 'not_found' });
    await expect(service.getItemById('99')).resolves.toBeNull();
  });

  it('只能编辑自己发布的物品', async () => {
    const repository = createInMemoryRepository([
      makeItem({ id: '1', ownerId: 'someone-else' }),
      makeItem({ id: '2', ownerId: 'local-user' }),
    ]);
    const service = createItemService(repository);

    await expectItemError(
      service.updateItem('1', { title: '新标题' }),
      'forbidden'
    );
    const updated = await service.updateItem('2', { title: '  新标题  ' });
    expect(updated?.title).toBe('新标题');
    expect(updated?.updatedAt).toBeGreaterThan(1000);
  });

  it('标记已找回对已处理物品幂等', async () => {
    const repository = createInMemoryRepository([makeItem({ id: '1' })]);
    const service = createItemService(repository);

    const first = await service.markResolved('1');
    expect(first.status).toBe('resolved');
    const second = await service.markResolved('1');
    expect(second.status).toBe('resolved');
    expect(second.updatedAt).toBe(first.updatedAt);
  });

  it('删除物品:他人的拒绝、不存在报错、成功后列表移除', async () => {
    const repository = createInMemoryRepository([
      makeItem({ id: '1', ownerId: 'someone-else' }),
      makeItem({ id: '2', ownerId: 'local-user' }),
    ]);
    const service = createItemService(repository);

    await expectItemError(service.deleteItem('1'), 'forbidden');
    await expectItemError(service.deleteItem('99'), 'not_found');

    await service.deleteItem('2');
    expect(repository.all().map(item => item.id)).toEqual(['1']);
  });
});

describe('ItemError', () => {
  it('保留错误码与出错字段供界面提示', () => {
    const error = new ItemError('validation', '请填写物品名称', 'title');
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('validation');
    expect(error.field).toBe('title');
  });
});
