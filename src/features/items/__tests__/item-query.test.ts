import { getProfileStats, localDateString, queryItems } from '../item-query';
import type { CampusItem } from '../item';

function daysAgoDate(days: number): string {
  return localDateString(Date.now() - days * 86400000);
}

function makeItem(overrides: Partial<CampusItem> = {}): CampusItem {
  return {
    id: '1',
    type: 'lost',
    status: 'active',
    ownerId: 'local-user',
    createdAt: 1000,
    updatedAt: 1000,
    title: '黑色双肩包',
    location: '图书馆三楼',
    date: daysAgoDate(0),
    time: '18:40',
    locationDetail: '图书馆三楼 · 自习区',
    description: '内有笔记本电脑',
    contact: '139 5678 1234',
    imageAssetKey: null,
    imageUri: null,
    ...overrides,
  };
}

// createdAt 依次递减:默认排序下顺序应为 1 → 2 → 3 → 4
const ITEMS: CampusItem[] = [
  makeItem({ id: '1', type: 'lost', status: 'active', title: '黑色双肩包', location: '图书馆三楼', createdAt: 5000 }),
  makeItem({ id: '2', type: 'found', status: 'active', title: 'Blue Card', location: '教学楼A栋', date: daysAgoDate(6), createdAt: 4000 }),
  makeItem({ id: '3', type: 'lost', status: 'resolved', title: '校园卡（绿色）', location: '实验楼', date: daysAgoDate(8), createdAt: 3000 }),
  makeItem({ id: '4', type: 'found', status: 'active', title: '白色保温杯', location: '食堂一楼', date: daysAgoDate(40), createdAt: 2000, ownerId: 'other' }),
];

function ids(items: CampusItem[]): string[] {
  return items.map(item => item.id);
}

describe('queryItems 过滤', () => {
  it('按类型过滤:招领只保留 found 帖子', () => {
    expect(ids(queryItems(ITEMS, { type: 'found' }))).toEqual(['2', '4']);
  });

  it('关键词同时匹配标题与地点,忽略大小写和首尾空白', () => {
    expect(ids(queryItems(ITEMS, { keyword: '  card  ' }))).toEqual(['2']);
    expect(ids(queryItems(ITEMS, { keyword: '图书馆' }))).toEqual(['1']);
    expect(queryItems(ITEMS, { keyword: '不存在的关键词' })).toEqual([]);
  });

  it('区域筛选:选择教学楼时实验楼也算教学楼片区', () => {
    expect(ids(queryItems(ITEMS, { area: '教学楼' }))).toEqual(['2', '3']);
    expect(ids(queryItems(ITEMS, { area: '食堂' }))).toEqual(['4']);
  });

  it('时间筛选:近7天含第 6 天、近30天含第 8 天,非法日期始终排除', () => {
    expect(ids(queryItems(ITEMS, { time: '近7天' }))).toEqual(['1', '2']);
    expect(ids(queryItems(ITEMS, { time: '近30天' }))).toEqual(['1', '2', '3']);
    const withInvalidDate = [...ITEMS, makeItem({ id: '5', date: 'not-a-date', createdAt: 6000 })];
    expect(ids(queryItems(withInvalidDate, { time: '近30天' }))).toEqual(['1', '2', '3']);
    expect(ids(queryItems(withInvalidDate, { time: '全部时间' }))).toEqual(['5', '1', '2', '3', '4']);
  });

  it('状态与发布者过滤', () => {
    expect(ids(queryItems(ITEMS, { status: 'resolved' }))).toEqual(['3']);
    expect(ids(queryItems(ITEMS, { ownerId: 'other' }))).toEqual(['4']);
  });
});

describe('queryItems 排序', () => {
  it('默认按发布时间从新到旧', () => {
    expect(ids(queryItems(ITEMS))).toEqual(['1', '2', '3', '4']);
  });

  it('最早发布按时间从旧到新', () => {
    expect(ids(queryItems(ITEMS, { sort: '最早发布' }))).toEqual(['4', '3', '2', '1']);
  });

  it('发布时间相同的时候按 id 决定先后', () => {
    const tied = [
      makeItem({ id: '1', title: '先发布的', createdAt: 100 }),
      makeItem({ id: '2', title: '后发布的', createdAt: 100 }),
    ];
    expect(ids(queryItems(tied))).toEqual(['2', '1']);
    expect(ids(queryItems(tied, { sort: '最早发布' }))).toEqual(['1', '2']);
  });
});

describe('getProfileStats', () => {
  it('按发布者统计发布数与已解决数', () => {
    expect(getProfileStats(ITEMS, 'local-user')).toEqual({ published: 3, resolved: 1, active: 2 });
    expect(getProfileStats(ITEMS, 'other')).toEqual({ published: 1, resolved: 0, active: 1 });
  });

  it('没有发布记录时统计为零', () => {
    expect(getProfileStats(ITEMS, 'nobody')).toEqual({ published: 0, resolved: 0, active: 0 });
  });
});
