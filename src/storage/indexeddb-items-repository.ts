import type { CampusItem, ItemRepository } from '../features/items/item';
import { ITEM_DATABASE_NAME, ITEM_DATABASE_VERSION } from './item-schema';
import { getSeedItems } from './seed-items';

type StoredItem = Omit<CampusItem, 'id'> & { id: number };

function mapItem(row: StoredItem): CampusItem {
  return { ...row, id: String(row.id) };
}

export function createIndexedDbItemsRepository(): ItemRepository {
  let connection: Promise<IDBDatabase> | undefined;

  function database(): Promise<IDBDatabase> {
    connection ??= new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('当前浏览器不支持 IndexedDB'));
        return;
      }
      const request = indexedDB.open(ITEM_DATABASE_NAME, ITEM_DATABASE_VERSION);
      let failed = false;
      request.onupgradeneeded = () => {
        const store = request.result.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        for (const item of getSeedItems()) {
          store.add({ ...item, id: Number(item.id) });
        }
      };
      request.onerror = () => {
        failed = true;
        reject(request.error ?? new Error('无法打开本地数据库'));
      };
      request.onblocked = () => {
        failed = true;
        reject(new Error('请关闭其他旧版本页面后重试'));
      };
      request.onsuccess = () => {
        const db = request.result;
        if (failed) {
          db.close();
          return;
        }
        db.onversionchange = () => {
          db.close();
          connection = undefined;
        };
        resolve(db);
      };
    }).catch((error) => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  async function execute<T>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore, setResult: (value: T) => void) => void
  ): Promise<T> {
    const db = await database();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction('items', mode);
      let result: T;
      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => reject(transaction.error ?? new Error('本地数据写入失败'));
      try {
        operation(transaction.objectStore('items'), value => (result = value));
      } catch (error) {
        transaction.abort();
        reject(error);
      }
    });
  }

  function mutate(
    id: string,
    ownerId: string,
    change: (item: StoredItem) => StoredItem | null
  ): Promise<CampusItem | null> {
    return execute('readwrite', (store, setResult) => {
      const request = store.get(Number(id));
      request.onsuccess = () => {
        const item: StoredItem | undefined = request.result;
        if (!item || item.ownerId !== ownerId) {
          setResult(null);
          return;
        }
        const updated = change(item);
        if (updated) {
          store.put(updated);
          setResult(mapItem(updated));
        } else {
          store.delete(item.id);
          setResult(mapItem(item));
        }
      };
    });
  }

  return {
    list: () => execute('readonly', (store, setResult) => {
      const request = store.getAll();
      request.onsuccess = () => setResult((request.result as StoredItem[]).map(mapItem));
    }),
    find: id => execute('readonly', (store, setResult) => {
      const request = store.get(Number(id));
      request.onsuccess = () => setResult(request.result ? mapItem(request.result) : null);
    }),
    create: item => execute('readwrite', (store, setResult) => {
      const request = store.add(item);
      request.onsuccess = () => setResult({ ...item, id: String(request.result) });
    }),
    updateContent: (id, ownerId, content, updatedAt) => mutate(id, ownerId, item => ({
      ...item, ...content, updatedAt,
    })),
    resolve: (id, ownerId, updatedAt) => mutate(id, ownerId, item => ({ ...item, status: 'resolved', updatedAt })),
    remove: async (id, ownerId) => await mutate(id, ownerId, () => null) !== null,
  };
}
