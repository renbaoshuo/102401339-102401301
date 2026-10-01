export const ITEM_DATABASE_NAME = 'campus-lost-and-found';
export const ITEM_DATABASE_VERSION = 1;

export const ITEM_SCHEMA = `
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved')),
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  location TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  location_detail TEXT NOT NULL,
  description TEXT NOT NULL,
  contact TEXT NOT NULL CHECK (length(trim(contact)) > 0),
  image_asset_key TEXT,
  image_uri TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (image_asset_key IS NULL OR image_uri IS NULL)
);
CREATE INDEX idx_items_created ON items(created_at DESC, id DESC);
CREATE INDEX idx_items_owner_created ON items(owner_id, created_at DESC, id DESC);
`;
