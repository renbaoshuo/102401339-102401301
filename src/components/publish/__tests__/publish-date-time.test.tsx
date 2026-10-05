import { fireEvent, render, screen } from '@testing-library/react-native';

import PublishScreen from '@/app/(tabs)/publish';
import type { DateTimeInputProps } from '@/components/publish/date-time-input';
import { useItems } from '@/features/items/items-context';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), navigate: jest.fn() } }));
jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));
jest.mock('@/features/items/items-context', () => ({ useItems: jest.fn() }));
jest.mock('react-native-safe-area-context', () => jest.requireActual('react-native-safe-area-context/jest/mock').default);
// Exercise the real web control even though the default Jest preset targets native.
jest.mock('@/components/publish/date-time-input', () => jest.requireActual('@/components/publish/date-time-input.web'));
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = jest.requireActual('react-native');
  return function MockDateTimePicker(props: object) {
    return <View {...props} testID="native-picker" />;
  };
});

const { DateTimeInput: NativeDateTimeInput } = jest.requireActual<{
  DateTimeInput: (props: DateTimeInputProps) => React.JSX.Element;
}>('@/components/publish/date-time-input');

const createItem = jest.fn();

beforeEach(() => {
  jest.mocked(useItems).mockReturnValue({
    items: [],
    currentUserId: 'local-user',
    createItem,
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
    markResolved: jest.fn(),
    refreshing: false,
    refresh: jest.fn(),
    error: null,
  });
  createItem.mockImplementation(async input => ({
    ...input,
    id: '99',
    status: 'active',
    ownerId: 'local-user',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
});

it.each(['寻物', '招领'])('网页版%s选择和清空时间后，必填校验及提交使用本地日期时间', async (label) => {
  await render(<PublishScreen />);
  await fireEvent.press(screen.getByRole('tab', { name: label }));
  await fireEvent.changeText(screen.getByPlaceholderText('请输入物品名称，如：校园卡'), '校园卡');
  await fireEvent.changeText(screen.getByPlaceholderText('请输入手机号或微信号'), 'test-contact');
  await fireEvent.press(screen.getByRole('button', { name: '选择地点' }));
  await fireEvent.press(screen.getByRole('radio', { name: '图书馆' }));

  const input = screen.getByLabelText('选择时间');
  await fireEvent(input, 'change', { currentTarget: { value: '2024-05-20T00:15' } });
  await fireEvent(input, 'change', { currentTarget: { value: '' } });
  await fireEvent.press(screen.getByRole('button', { name: '立即发布' }));
  expect(createItem).not.toHaveBeenCalled();
  expect(screen.getByText('还有 1 项必填内容需要完善')).toBeOnTheScreen();

  const time = label === '寻物' ? '00:15' : '23:40';
  await fireEvent(input, 'change', { currentTarget: { value: `2024-05-20T${time}` } });
  expect(input).toHaveProp('value', `2024-05-20T${time}`);
  await fireEvent.press(screen.getByRole('button', { name: '立即发布' }));
  expect(createItem).toHaveBeenCalledWith(expect.objectContaining({
    type: label === '寻物' ? 'lost' : 'found',
    date: '2024-05-20',
    time,
  }));
  expect(screen.getByText('发布成功！')).toBeOnTheScreen();
});

it('原生选择日期后再选择时间，合并结果且取消不改动原值', async () => {
  const onChange = jest.fn();
  await render(<NativeDateTimeInput value={new Date(2024, 4, 20, 18, 40)} onChange={onChange} />);
  await fireEvent.press(screen.getByRole('button', { name: '选择时间' }));
  await fireEvent(screen.getByTestId('native-picker'), 'change', { type: 'set' }, new Date(2024, 4, 21, 18, 40));
  await fireEvent(screen.getByTestId('native-picker'), 'change', { type: 'set' }, new Date(2026, 9, 5, 9, 30));
  expect(onChange).toHaveBeenCalledWith(new Date(2024, 4, 21, 9, 30));

  onChange.mockClear();
  await fireEvent.press(screen.getByRole('button', { name: '选择时间' }));
  await fireEvent(screen.getByTestId('native-picker'), 'change', { type: 'dismissed' });
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.queryByTestId('native-picker')).toBeNull();
});
