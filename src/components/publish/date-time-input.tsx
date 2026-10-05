import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Keyboard, Pressable, Text } from 'react-native';

import { localDateString } from '@/features/items/item-query';

export type DateTimeInputProps = {
  value: Date | null;
  onChange: (value: Date | null) => void;
};

export function DateTimeInput({ value, onChange }: DateTimeInputProps) {
  const [stage, setStage] = useState<'date' | 'time' | null>(null);
  const [draft, setDraft] = useState(() => new Date());

  return (
    <>
      <Pressable
        className="h-[39px] flex-row items-center rounded-[10px] border border-[#E9E2D8] bg-[#F1EBE3] pl-[15px]"
        onPress={() => {
          Keyboard.dismiss();
          setDraft(value ?? new Date());
          setStage('date');
        }}
        accessibilityRole="button"
        accessibilityLabel="选择时间"
      >
        <Text className="text-[14px]" style={{ color: value ? '#292D29' : '#A6A49F' }}>
          {value
            ? `${localDateString(value.getTime())} ${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
            : '请选择时间'}
        </Text>
      </Pressable>
      {stage
        ? (
            <DateTimePicker
              value={draft}
              mode={stage}
              is24Hour
              maximumDate={stage === 'date' ? new Date() : undefined}
              onChange={(event, selected) => {
                if (event.type === 'dismissed') {
                  setStage(null);
                  return;
                }
                const next = selected ?? draft;
                if (stage === 'date') {
                  setDraft(next);
                  setStage('time');
                  return;
                }
                const combined = new Date(draft);
                combined.setHours(next.getHours(), next.getMinutes(), 0, 0);
                onChange(combined);
                setStage(null);
              }}
            />
          )
        : null}
    </>
  );
}
