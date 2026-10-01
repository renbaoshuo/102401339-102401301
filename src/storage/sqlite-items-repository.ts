import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import type { CampusItem, ItemContent, ItemRepository } from '../features/items/item';
import { ITEM_DATABASE_NAME, ITEM_DATABASE_VERSION, ITEM_SCHEMA } from './item-schema';
import { getSeedItems } from './seed-items';

type StoredItem = Omit<CampusItem, 'id'> & { id: number };
type Queries = Pick<SQLiteDatabase, 'runAsync' | 'getFirstAsync'>;

const SELECT_ITEM = `SELECT id, type, status, owner_id AS ownerId, title, location,
  event_date AS date, event_time AS time, location_detail AS locationDetail,
  description, contact, image_asset_key AS imageAssetKey, image_uri AS imageUri,
  created_at AS createdAt, updated_at AS updatedAt FROM items`;

const INSERT_ITEM = `INSERT INTO items (
  type, status, owner_id, title, location, event_date, event_time, location_detail,
  description, contact, image_asset_key, image_uri, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

function contentValues(content: ItemContent) {
  return [
    content.title, content.location, content.date, content.time, content.locationDetail,
    content.description, content.contact, content.imageAssetKey, content.imageUri,
  ];
}

function mapItem(row: StoredItem): CampusItem {
  return { ...row, id: String(row.id) };
}

async function write<T>(db: SQLiteDatabase, operation: (transaction: Queries) => Promise<T>): Promise<T> {
  let result!: T;
  await db.withExclusiveTransactionAsync(async (transaction) => {
    result = await operation(transaction);
  });
  return result;
}

async function initialize(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL');
  const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if (!version || version.user_version > ITEM_DATABASE_VERSION) {
    throw new Error('本地数据库版本不受当前应用支持');
  }
  if (version.user_version === ITEM_DATABASE_VERSION) {
    return;
  }
  await db.withExclusiveTransactionAsync(async (transaction) => {
    await transaction.execAsync(ITEM_SCHEMA);
    for (const item of getSeedItems()) {
      await transaction.runAsync(
        INSERT_ITEM.replace('items (', 'items (id, ').replace('VALUES (', 'VALUES (?, '),
        [Number(item.id), item.type, item.status, item.ownerId, ...contentValues(item), item.createdAt, item.updatedAt]
      );
    }
    await transaction.execAsync(`PRAGMA user_version = ${ITEM_DATABASE_VERSION}`);
  });
}

export function createSqliteItemsRepository(): ItemRepository {
  let connection: Promise<SQLiteDatabase> | undefined;
  let queue: Promise<unknown> = Promise.resolve();

  function database(): Promise<SQLiteDatabase> {
    connection ??= (async () => {
      const db = await openDatabaseAsync(`${ITEM_DATABASE_NAME}.db`);
      try {
        await initialize(db);
        return db;
      } catch (error) {
        await db.closeAsync();
        throw error;
      }
    })().catch((error) => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  // 单连接上的读写排队，防止异步查询插入初始化或写入后的读取过程。
  function execute<T>(operation: (db: SQLiteDatabase) => Promise<T>): Promise<T> {
    const result = queue.then(async () => operation(await database()));
    queue = result.catch(() => undefined);
    return result;
  }

  async function find(db: Queries, id: string): Promise<CampusItem | null> {
    const row = await db.getFirstAsync<StoredItem>(`${SELECT_ITEM} WHERE id = ?`, [Number(id)]);
    return row ? mapItem(row) : null;
  }

  return {
    list: () => execute(async db => (await db.getAllAsync<StoredItem>(SELECT_ITEM)).map(mapItem)),
    find: id => execute(db => find(db, id)),
    create: item => execute(db => write(db, async (transaction) => {
      const result = await transaction.runAsync(INSERT_ITEM, [
        item.type, item.status, item.ownerId, ...contentValues(item), item.createdAt, item.updatedAt,
      ]);
      const created = await find(transaction, String(result.lastInsertRowId));
      if (!created) {
        throw new Error('无法读取新发布的信息');
      }
      return created;
    })),
    updateContent: (id, ownerId, content, updatedAt) => execute(db => write(db, async (transaction) => {
      const result = await transaction.runAsync(`UPDATE items SET
        title = ?, location = ?, event_date = ?, event_time = ?, location_detail = ?,
        description = ?, contact = ?, image_asset_key = ?, image_uri = ?, updated_at = ?
        WHERE id = ? AND owner_id = ?`, [...contentValues(content), updatedAt, Number(id), ownerId]);
      return result.changes === 1 ? find(transaction, id) : null;
    })),
    resolve: (id, ownerId, updatedAt) => execute(db => write(db, async (transaction) => {
      const result = await transaction.runAsync(
        'UPDATE items SET status = ?, updated_at = ? WHERE id = ? AND owner_id = ?',
        ['resolved', updatedAt, Number(id), ownerId]
      );
      return result.changes === 1 ? find(transaction, id) : null;
    })),
    remove: (id, ownerId) => execute(async db => (
      await db.runAsync('DELETE FROM items WHERE id = ? AND owner_id = ?', [Number(id), ownerId])
    ).changes === 1),
  };
}
