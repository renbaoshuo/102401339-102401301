import { localDateString } from '@/features/items/item-query';

import type { DateTimeInputProps } from './date-time-input';

export function DateTimeInput({ value, onChange }: DateTimeInputProps) {
  // datetime-local uses local wall time; ISO strings would shift it to UTC.
  const formatted = value
    ? `${localDateString(value.getTime())}T${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
    : '';

  return (
    <input
      type="datetime-local"
      aria-label="选择时间"
      value={formatted}
      max={`${localDateString(Date.now())}T23:59`}
      onChange={(event) => {
        const selected = event.currentTarget.value;
        onChange(selected ? new Date(selected) : null);
      }}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
        height: 39,
        borderRadius: 10,
        border: '1px solid #E9E2D8',
        backgroundColor: '#F1EBE3',
        padding: '0 15px',
        fontFamily: 'inherit',
        fontSize: 14,
        color: value ? '#292D29' : '#A6A49F',
      }}
    />
  );
}
