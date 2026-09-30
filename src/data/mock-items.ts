export type ItemType = 'lost' | 'found';

export type CampusItem = {
  id: string;
  type: ItemType;
  title: string;
  location: string;
  date: string;
  image: number;
  time: string;
  locationDetail: string;
  description: string;
  contact: string;
};

export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  lost: '寻物中',
  found: '待认领',
};

export const ITEM_KIND_LABEL: Record<ItemType, string> = {
  lost: '寻物',
  found: '招领',
};

export const ITEM_KIND_STYLE: Record<ItemType, { bg: string; text: string }> = {
  lost: { bg: '#E7EFE1', text: '#5F834B' },
  found: { bg: '#D9E8F0', text: '#476F83' },
};

export const ITEM_STATUS_STYLE: Record<ItemType, { bg: string; text: string }> = {
  lost: { bg: '#F4D2CD', text: '#9E534F' },
  found: { bg: '#F8DFA5', text: '#705B2F' },
};

export function getItemById(id: string | string[] | undefined): CampusItem | undefined {
  const key = Array.isArray(id) ? id[0] : id;
  return MOCK_ITEMS.find(item => item.id === key);
}

export const MOCK_ITEMS: CampusItem[] = [
  {
    id: '1',
    type: 'lost',
    title: '黑色双肩包',
    location: '图书馆三楼',
    date: '2024-05-20',
    image: require('@/assets/images/home/item-backpack.png'),
    time: '18:40',
    locationDetail: '图书馆三楼 · 自习区',
    description: '在图书馆三楼自习区落下一个黑色双肩包，内有笔记本电脑和几本教材，请拾到的同学联系我，非常感谢！',
    contact: '139 5678 1234',
  },
  {
    id: '2',
    type: 'found',
    title: '蓝色校园卡',
    location: '教学楼A栋',
    date: '2024-05-19',
    image: require('@/assets/images/home/item-campus-card.png'),
    time: '14:30',
    locationDetail: '教学楼A栋 · 二楼走廊',
    description: '在教学楼A栋二楼走廊捡到一张蓝色校园卡，看起来是XX大学的。卡面比较新，希望早日找到主人！',
    contact: '138 1234 5678',
  },
  {
    id: '3',
    type: 'lost',
    title: 'AirPods 耳机',
    location: '体育馆',
    date: '2024-05-18',
    image: require('@/assets/images/home/item-airpods.png'),
    time: '20:15',
    locationDetail: '体育馆 · 羽毛球场',
    description: '打完球发现 AirPods 耳机不见了，白色充电盒上有贴纸，大概是在羽毛球场附近丢的，麻烦捡到的同学联系我。',
    contact: '137 2468 1357',
  },
  {
    id: '4',
    type: 'found',
    title: '白色保温杯',
    location: '食堂一楼',
    date: '2024-05-17',
    image: require('@/assets/images/home/item-thermos.png'),
    time: '12:05',
    locationDetail: '食堂一楼 · 靠窗餐位',
    description: '在食堂一楼靠窗的餐位上捡到一个白色保温杯，杯身有挂绳，应该是同学用餐后忘记带走的。',
    contact: '136 9876 5432',
  },
  {
    id: '5',
    type: 'lost',
    title: '一串钥匙',
    location: '操场看台',
    date: '2024-05-16',
    image: require('@/assets/images/home/keys.png'),
    time: '17:30',
    locationDetail: '操场看台 · 第三排',
    description: '在操场看台第三排落下了一串钥匙，钥匙扣是蓝色的，上面有宿舍和柜子钥匙，捡到的同学请务必联系我！',
    contact: '135 1122 3344',
  },
  {
    id: '6',
    type: 'lost',
    title: '校园卡（红色）',
    location: '图书馆',
    date: '2024-05-18',
    image: require('@/assets/images/home/card-red.png'),
    time: '09:20',
    locationDetail: '图书馆 · 一楼大厅',
    description: '在图书馆一楼大厅丢失一张红色校园卡，卡套是透明的，捡到的同学请联系我，谢谢！',
    contact: '188 5566 7788',
  },
  {
    id: '7',
    type: 'found',
    title: '校园卡（绿色）',
    location: '实验楼',
    date: '2024-05-16',
    image: require('@/assets/images/home/card-green.png'),
    time: '15:45',
    locationDetail: '实验楼 · 302 实验室',
    description: '在实验楼302实验室捡到一张绿色校园卡，卡面有磨损，请失主联系认领。',
    contact: '150 3344 5566',
  },
  {
    id: '8',
    type: 'lost',
    title: '学生校园卡',
    location: '操场',
    date: '2024-05-15',
    image: require('@/assets/images/home/item-campus-card.png'),
    time: '16:10',
    locationDetail: '操场 · 跑道旁',
    description: '傍晚在操场跑步时弄丢了学生校园卡，深蓝色卡面，希望好心同学捡到后联系我。',
    contact: '186 7788 9900',
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
