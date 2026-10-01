import type { CampusItem, ItemStatus, ItemType } from './item';

export type AreaOption = '全部区域' | '教学楼' | '图书馆' | '食堂' | '宿舍' | '操场';
export type TimeOption = '近7天' | '近30天' | '全部时间';
export type SortOption = '默认排序' | '最新发布' | '最早发布';

export const AREA_OPTIONS: AreaOption[] = ['全部区域', '教学楼', '图书馆', '食堂', '宿舍', '操场'];
export const TIME_OPTIONS: TimeOption[] = ['近7天', '近30天', '全部时间'];
export const SORT_OPTIONS: SortOption[] = ['默认排序', '最新发布', '最早发布'];

export type ItemFilters = {
  keyword?: string;
  type?: ItemType | 'all';
  status?: ItemStatus;
  ownerId?: string;
  area?: AreaOption;
  time?: TimeOption;
  sort?: SortOption;
};

export function localDateString(now: number): string {
  const date = new Date(now);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isFinite(parsed.getTime()) && localDateString(parsed.getTime()) === value;
}

function matchesArea(location: string, area: AreaOption): boolean {
  if (area === '全部区域') {
    return true;
  }
  return area === '教学楼'
    ? location.includes('教学楼') || location.includes('实验楼')
    : location.includes(area);
}

function matchesTime(date: string, time: TimeOption, now: number): boolean {
  if (time === '全部时间') {
    return true;
  }
  if (!isValidDate(date)) {
    return false;
  }
  const today = new Date(now);
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  from.setDate(from.getDate() - (time === '近7天' ? 6 : 29));
  return date >= localDateString(from.getTime()) && date <= localDateString(now);
}

export function queryItems(items: readonly CampusItem[], filters: ItemFilters = {}): CampusItem[] {
  const now = Date.now();
  const keyword = filters.keyword?.trim().toLowerCase() ?? '';
  const results = items.filter(item => (
    (!filters.type || filters.type === 'all' || item.type === filters.type)
    && (!filters.status || item.status === filters.status)
    && (!filters.ownerId || item.ownerId === filters.ownerId)
    && matchesArea(item.location, filters.area ?? '全部区域')
    && matchesTime(item.date, filters.time ?? '全部时间', now)
    && (!keyword || item.title.toLowerCase().includes(keyword) || item.location.toLowerCase().includes(keyword))
  ));
  const direction = filters.sort === '最早发布' ? 1 : -1;
  return results.sort((a, b) => direction * (a.createdAt - b.createdAt || Number(a.id) - Number(b.id)));
}

export function getProfileStats(items: readonly CampusItem[], ownerId: string) {
  const own = items.filter(item => item.ownerId === ownerId);
  const resolved = own.filter(item => item.status === 'resolved').length;
  return { published: own.length, resolved, active: own.length - resolved };
}
