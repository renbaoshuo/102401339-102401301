import { getItemStatusStyle, getItemStatusLabel, ITEM_KIND_LABEL } from '../item-presentation';
import type { CampusItem, ItemStatus, ItemType } from '../item';

type StatusCase = { type: ItemType; status: ItemStatus; label: string; bg: string; text: string };

// 徽章矩阵:类型(寻物/招领)× 状态(进行中/已解决)共 4 种组合
const CASES: StatusCase[] = [
  { type: 'lost', status: 'active', label: '寻物中', bg: '#F4D2CD', text: '#9E534F' },
  { type: 'found', status: 'active', label: '待认领', bg: '#F8DFA5', text: '#786234' },
  { type: 'lost', status: 'resolved', label: '已找回', bg: '#DCEFD9', text: '#52885E' },
  { type: 'found', status: 'resolved', label: '已归还', bg: '#DCEFD9', text: '#52885E' },
];

function makeItem(type: ItemType, status: ItemStatus): Pick<CampusItem, 'type' | 'status'> {
  return { type, status };
}

describe.each(CASES)('徽章 ($type × $status)', ({ type, status, label, bg, text }) => {
  const item = makeItem(type, status);

  it(`状态文案为「${label}」`, () => {
    expect(getItemStatusLabel(item)).toBe(label);
  });

  it(`徽章配色为 ${bg}/${text}`, () => {
    expect(getItemStatusStyle(item)).toEqual({ bg, text });
  });
});

describe('类别标签', () => {
  it('寻物与招领分别显示对应类别名', () => {
    expect(ITEM_KIND_LABEL.lost).toBe('寻物');
    expect(ITEM_KIND_LABEL.found).toBe('招领');
  });
});
