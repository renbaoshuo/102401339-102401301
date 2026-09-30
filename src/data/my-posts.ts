export type MyPostStatus = 'lost' | 'found' | 'returned';

export type MyPostItem = {
  id: string;
  status: MyPostStatus;
  title: string;
  date: string;
  location: string;
  image: number;
  thumbTint: string;
};

export const MY_POST_STATUS_LABEL: Record<MyPostStatus, string> = {
  lost: '寻物中',
  found: '待认领',
  returned: '已找回',
};

export const MY_POST_STATUS_STYLE: Record<MyPostStatus, { bg: string; text: string }> = {
  lost: { bg: '#F4D2CD', text: '#9E534F' },
  found: { bg: '#F8DFA5', text: '#786234' },
  returned: { bg: '#DCEFD9', text: '#52885E' },
};

export const PROFILE = {
  name: '喵同学',
  tagline: '愿校园多一些善意',
  avatar: require('@/assets/images/home/avatar-cat.png') as number,
  stats: [
    { value: '5', label: '我发布的' },
    { value: '3', label: '成功找回' },
    { value: '12', label: '收到感谢' },
  ],
};

export const MY_POSTS: MyPostItem[] = [
  {
    id: '1',
    status: 'lost',
    title: '黑色双肩包',
    date: '2024-05-20',
    location: '图书馆',
    image: require('@/assets/images/home/item-backpack.png'),
    thumbTint: '#DFD4BF',
  },
  {
    id: '4',
    status: 'found',
    title: '白色保温杯',
    date: '2024-05-17',
    location: '食堂一楼',
    image: require('@/assets/images/home/item-thermos.png'),
    thumbTint: '#DDD8C2',
  },
  {
    id: '5',
    status: 'returned',
    title: '钥匙串',
    date: '2024-05-12',
    location: '操场',
    image: require('@/assets/images/home/keys.png'),
    thumbTint: '#D9C8A8',
  },
];
