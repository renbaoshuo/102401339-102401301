export type ItemType = 'lost' | 'found';

export type CampusItem = {
  id: string;
  type: ItemType;
  title: string;
  location: string;
  date: string;
  image: number;
};

export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  lost: '寻物中',
  found: '待认领',
};

export const MOCK_ITEMS: CampusItem[] = [
  {
    id: '1',
    type: 'lost',
    title: '黑色双肩包',
    location: '图书馆三楼',
    date: '2024-05-20',
    image: require('@/assets/images/home/item-backpack.png'),
  },
  {
    id: '2',
    type: 'found',
    title: '蓝色校园卡',
    location: '教学楼A栋',
    date: '2024-05-19',
    image: require('@/assets/images/home/item-campus-card.png'),
  },
  {
    id: '3',
    type: 'lost',
    title: 'AirPods 耳机',
    location: '体育馆',
    date: '2024-05-18',
    image: require('@/assets/images/home/item-airpods.png'),
  },
  {
    id: '4',
    type: 'found',
    title: '白色保温杯',
    location: '食堂一楼',
    date: '2024-05-17',
    image: require('@/assets/images/home/item-thermos.png'),
  },
  {
    id: '5',
    type: 'lost',
    title: '一串钥匙',
    location: '操场看台',
    date: '2024-05-16',
    image: require('@/assets/images/home/keys.png'),
  },
  {
    id: '6',
    type: 'lost',
    title: '校园卡（红色）',
    location: '图书馆',
    date: '2024-05-18',
    image: require('@/assets/images/home/card-red.png'),
  },
  {
    id: '7',
    type: 'found',
    title: '校园卡（绿色）',
    location: '实验楼',
    date: '2024-05-16',
    image: require('@/assets/images/home/card-green.png'),
  },
  {
    id: '8',
    type: 'lost',
    title: '学生校园卡',
    location: '操场',
    date: '2024-05-15',
    image: require('@/assets/images/home/item-campus-card.png'),
  },
];

export type AreaOption = '全部区域' | '教学楼' | '图书馆' | '食堂' | '宿舍' | '操场';
export type TimeOption = '近7天' | '近30天' | '全部时间';
export type SortOption = '默认排序' | '最新发布' | '最早发布';

export const AREA_OPTIONS: AreaOption[] = ['全部区域', '教学楼', '图书馆', '食堂', '宿舍', '操场'];
export const TIME_OPTIONS: TimeOption[] = ['近7天', '近30天', '全部时间'];
export const SORT_OPTIONS: SortOption[] = ['默认排序', '最新发布', '最早发布'];

export function matchesArea(location: string, area: AreaOption): boolean {
  if (area === '全部区域') {
    return true;
  }
  if (area === '教学楼') {
    return location.includes('教学楼') || location.includes('实验楼');
  }
  return location.includes(area);
}

// 演示数据日期固定,以数据中最新一条为基准判断时间范围
const TIME_ANCHOR = MOCK_ITEMS.reduce((latest, item) => (item.date > latest ? item.date : latest), '');

export function matchesTime(date: string, time: TimeOption): boolean {
  if (time === '全部时间') {
    return true;
  }
  const diffDays = (new Date(`${TIME_ANCHOR}T00:00:00`).getTime() - new Date(`${date}T00:00:00`).getTime()) / 86400000;
  if (time === '近7天') {
    return diffDays <= 7;
  }
  return diffDays <= 30;
}

export function sortItems(items: CampusItem[], sort: SortOption): CampusItem[] {
  if (sort === '默认排序') {
    return items;
  }
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  return sort === '最新发布' ? sorted.reverse() : sorted;
}
