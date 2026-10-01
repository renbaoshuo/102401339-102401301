import type { CampusItem, ItemType } from './item';

export const ITEM_KIND_LABEL: Record<ItemType, string> = { lost: '寻物', found: '招领' };
export const ITEM_KIND_STYLE: Record<ItemType, { bg: string; text: string }> = {
  lost: { bg: '#E7EFE1', text: '#5F834B' },
  found: { bg: '#D9E8F0', text: '#476F83' },
};

export function getItemStatusLabel(item: Pick<CampusItem, 'type' | 'status'>): string {
  if (item.status === 'resolved') {
    return item.type === 'lost' ? '已找回' : '已归还';
  }
  return item.type === 'lost' ? '寻物中' : '待认领';
}

export function getItemStatusStyle(item: Pick<CampusItem, 'type' | 'status'>) {
  if (item.status === 'resolved') {
    return { bg: '#DCEFD9', text: '#52885E' };
  }
  return item.type === 'lost'
    ? { bg: '#F4D2CD', text: '#9E534F' }
    : { bg: '#F8DFA5', text: '#786234' };
}
