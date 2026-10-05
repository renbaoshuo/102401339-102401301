import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';

import ProfileScreen from '@/app/(tabs)/profile';
import EditItemScreen from '@/app/edit/[id]';
import { ItemEditForm } from '@/components/profile/item-edit-form';
import type { CampusItem, ItemRepository } from '@/features/items/item';
import { createItemService } from '@/features/items/item-service';
import { useItem, useItems } from '@/features/items/items-context';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    dismissTo: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
  useLocalSearchParams: jest.fn(() => ({ id: '1' })),
}));
jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));
jest.mock('@/features/items/items-context', () => ({ useItems: jest.fn(), useItem: jest.fn() }));
jest.mock('react-native-safe-area-context', () => jest.requireActual('react-native-safe-area-context/jest/mock').default);
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = jest.requireActual('react-native');
  return function MockDateTimePicker(props: object) {
    return <View {...props} testID="native-picker" />;
  };
});

const ITEM: CampusItem = {
  id: '1',
  type: 'lost',
  status: 'active',
  ownerId: 'local-user',
  createdAt: 1000,
  updatedAt: 1000,
  title: '黑色双肩包',
  date: '2024-05-20',
  time: '18:40',
  location: '图书馆',
  locationDetail: '图书馆三楼自习区',
  description: '内有课本',
  contact: '139 5678 1234',
  imageAssetKey: 'backpack',
  imageUri: null,
};

let stored: CampusItem;
let updateItem: jest.MockedFunction<ReturnType<typeof useItems>['updateItem']>;
let updateContent: jest.MockedFunction<ItemRepository['updateContent']>;

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '1' });
  jest.replaceProperty(Platform, 'OS', 'web');
  stored = { ...ITEM };
  updateContent = jest.fn(async (_id, _ownerId, content, updatedAt) => {
    stored = { ...stored, ...content, updatedAt };
    return stored;
  });
  const repository = {
    find: jest.fn(async () => stored),
    updateContent,
  } as unknown as ItemRepository;
  const service = createItemService(repository);
  updateItem = jest.fn(service.updateItem);
  jest.mocked(useItems).mockReturnValue({
    items: [stored],
    currentUserId: 'local-user',
    updateItem,
    createItem: jest.fn(),
    deleteItem: jest.fn(),
    markResolved: jest.fn(),
    refreshing: false,
    refresh: jest.fn(),
    error: null,
  });
  jest.mocked(useItem).mockReturnValue(stored);
});

afterEach(() => jest.restoreAllMocks());

it('从我的发布进入对应物品的编辑页', async () => {
  await render(<ProfileScreen />);
  await fireEvent.press(screen.getByRole('button', { name: '编辑' }));
  expect(router.push).toHaveBeenCalledWith({ pathname: '/edit/[id]', params: { id: ITEM.id } });
});

it('回填原信息，保存到原记录并保留归属、状态和原图片', async () => {
  await render(<EditItemScreen />);
  expect(useItem).toHaveBeenCalledWith('1');
  expect(screen.getByLabelText('物品名称')).toHaveDisplayValue(ITEM.title);
  expect(screen.getByLabelText('日期')).toHaveDisplayValue(ITEM.date);
  expect(screen.getByLabelText('时间')).toHaveDisplayValue(ITEM.time);
  expect(screen.getByLabelText('详细地点')).toHaveDisplayValue(ITEM.locationDetail);
  expect(screen.getByLabelText('物品描述')).toHaveDisplayValue(ITEM.description);
  expect(screen.getByLabelText('联系方式')).toHaveDisplayValue(ITEM.contact);

  await fireEvent.changeText(screen.getByLabelText('物品名称'), '  黑色背包  ');
  await fireEvent.changeText(screen.getByLabelText('地点'), '教学楼');
  await fireEvent.changeText(screen.getByLabelText('详细地点'), '教学楼二楼');
  await fireEvent.changeText(screen.getByLabelText('联系方式'), 'wechat-student');
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));

  expect(stored).toMatchObject({
    ...ITEM,
    title: '黑色背包',
    location: '教学楼',
    locationDetail: '教学楼二楼',
    contact: 'wechat-student',
    updatedAt: expect.any(Number),
  });
  expect(stored.updatedAt).toBeGreaterThan(ITEM.updatedAt);
  expect(screen.getByText('修改已保存')).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole('button', { name: '查看我的发布' }));
  expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)/profile');
});

it('必填和日期校验失败不写入，保留草稿供修正', async () => {
  await render(<ItemEditForm item={ITEM} />);
  await fireEvent.changeText(screen.getByLabelText('物品名称'), '  ');
  await fireEvent.changeText(screen.getByLabelText('物品描述'), '草稿不丢失');
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(screen.getByRole('alert')).toHaveTextContent('请填写物品名称');
  expect(updateContent).not.toHaveBeenCalled();
  expect(screen.getByLabelText('物品描述')).toHaveDisplayValue('草稿不丢失');

  await fireEvent.changeText(screen.getByLabelText('物品名称'), '新标题');
  await fireEvent.changeText(screen.getByLabelText('日期'), '2024-02-30');
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(screen.getByRole('alert')).toHaveTextContent('请选择有效的丢失或拾取日期，日期不能晚于今天');
  expect(updateContent).not.toHaveBeenCalled();

  await fireEvent.changeText(screen.getByLabelText('日期'), ITEM.date);
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(stored.description).toBe('草稿不丢失');
  expect(screen.getByText('修改已保存')).toBeOnTheScreen();
});

it('保存中禁用重复提交，存储失败后保留输入并允许重试', async () => {
  let rejectSave!: (error: Error) => void;
  updateContent.mockImplementationOnce(() => new Promise((_resolve, reject) => {
    rejectSave = reject;
  }));
  await render(<ItemEditForm item={ITEM} />);
  await fireEvent.changeText(screen.getByLabelText('物品名称'), '保存失败的草稿');
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(screen.getByText('保存中…')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: '保存修改' })).toBeDisabled();
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(updateItem).toHaveBeenCalledTimes(1);

  await act(async () => rejectSave(new Error('disk full')));
  expect(screen.getByRole('alert')).toHaveTextContent('无法读写本地数据，请重试');
  expect(screen.getByLabelText('物品名称')).toHaveDisplayValue('保存失败的草稿');
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(stored.title).toBe('保存失败的草稿');
});

it('移除图片会清除原来的示例图片引用', async () => {
  await render(<ItemEditForm item={ITEM} />);
  await fireEvent.press(screen.getByRole('button', { name: '移除图片' }));
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(stored.imageAssetKey).toBeNull();
  expect(stored.imageUri).toBeNull();
});

it('替换网页图片时保存可持久化的 data URI，取消选择保留原图', async () => {
  jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValueOnce({ canceled: true, assets: null });
  await render(<ItemEditForm item={ITEM} />);
  await fireEvent.press(screen.getByRole('button', { name: '替换图片' }));
  expect(screen.getByRole('button', { name: '移除图片' })).toBeOnTheScreen();

  jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValueOnce({
    canceled: false,
    assets: [{ uri: 'blob:temporary-image', base64: 'aW1hZ2U=', mimeType: 'image/png', width: 100, height: 100 }],
  });
  await fireEvent.press(screen.getByRole('button', { name: '替换图片' }));
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(stored.imageUri).toBe('data:image/png;base64,aW1hZ2U=');
  expect(stored.imageAssetKey).toBeNull();
});

it.each([['不存在的信息', undefined], ['他人的信息', { ...ITEM, ownerId: 'another-user' }]])(
  '%s不能打开编辑表单',
  async (_label, item) => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ id: '99' });
    jest.mocked(useItem).mockReturnValue(item);
    await render(<EditItemScreen />);
    expect(screen.queryByRole('button', { name: '保存修改' })).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent(item ? '只能编辑自己发布的信息' : '该信息已被删除或不存在');
  }
);

it('iOS 选择日期和时间分别确认，取消不会改动原值', async () => {
  jest.replaceProperty(Platform, 'OS', 'ios');
  await render(<ItemEditForm item={ITEM} />);
  await fireEvent.press(screen.getByRole('button', { name: `选择日期，当前 ${ITEM.date}` }));
  await fireEvent(screen.getByTestId('native-picker'), 'change', { type: 'set' }, new Date(2024, 4, 21, 18, 40));
  await fireEvent.press(screen.getByRole('button', { name: '确定' }));
  await fireEvent.press(screen.getByRole('button', { name: `选择时间，当前 ${ITEM.time}` }));
  await fireEvent(screen.getByTestId('native-picker'), 'change', { type: 'set' }, new Date(2024, 4, 21, 9, 30));
  await fireEvent.press(screen.getByRole('button', { name: '取消' }));
  await fireEvent.press(screen.getByRole('button', { name: '保存修改' }));
  expect(stored.date).toBe('2024-05-21');
  expect(stored.time).toBe(ITEM.time);
});
