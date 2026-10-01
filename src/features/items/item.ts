export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'resolved';
export const ITEM_IMAGE_KEYS = ['backpack', 'campus-card', 'airpods', 'thermos', 'keys', 'card-red', 'card-green'] as const;
export type ItemImageKey = typeof ITEM_IMAGE_KEYS[number];

export const LOCAL_USER_ID = 'local-user';

export type ItemContent = {
  title: string;
  location: string;
  date: string;
  time: string;
  locationDetail: string;
  description: string;
  contact: string;
  imageAssetKey: ItemImageKey | null;
  imageUri: string | null;
};

export type CampusItem = ItemContent & {
  id: string;
  type: ItemType;
  status: ItemStatus;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
};

export type CreateItemInput = Pick<ItemContent, 'title' | 'location' | 'date' | 'contact'>
  & Partial<Omit<ItemContent, 'title' | 'location' | 'date' | 'contact'>>
  & { type: ItemType };

export type UpdateItemInput = Partial<ItemContent>;
export type NewItem = Omit<CampusItem, 'id'>;

export type ItemErrorCode = 'validation' | 'not_found' | 'forbidden' | 'storage';

export class ItemError extends Error {
  constructor(
    public readonly code: ItemErrorCode,
    message: string,
    public readonly field?: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'ItemError';
  }
}

// 存储实现只负责持久化；发布归属、校验和状态流转由业务服务处理。
export interface ItemRepository {
  list(): Promise<CampusItem[]>;
  find(id: string): Promise<CampusItem | null>;
  create(item: NewItem): Promise<CampusItem>;
  updateContent(id: string, ownerId: string, content: ItemContent, updatedAt: number): Promise<CampusItem | null>;
  resolve(id: string, ownerId: string, updatedAt: number): Promise<CampusItem | null>;
  remove(id: string, ownerId: string): Promise<boolean>;
}
