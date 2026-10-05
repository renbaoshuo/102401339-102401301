import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { localDateString } from '@/features/items/item-query';

type ItemDateTimeFieldsProps = {
  date: string;
  time: string;
  disabled: boolean;
  onChange: (value: { date?: string; time?: string }) => void;
};

const INPUT_CLASS = 'h-[44px] min-w-0 flex-1 justify-center rounded-[10px] border border-[#E9E2D8] bg-[#F1EBE3] px-[15px] text-[14px] text-[#292D29]';

export function ItemDateTimeFields({ date, time, disabled, onChange }: ItemDateTimeFieldsProps) {
  const [mode, setMode] = useState<'date' | 'time' | null>(null);
  const [draft, setDraft] = useState(() => new Date());

  const openPicker = (field: 'date' | 'time') => {
    Keyboard.dismiss();
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = (time || '12:00').split(':').map(Number);
    setDraft(new Date(year, month - 1, day, hours, minutes));
    setMode(field);
  };

  const select = (value: Date) => {
    onChange(mode === 'date'
      ? { date: localDateString(value.getTime()) }
      : { time: `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}` });
    setMode(null);
  };

  const picker = mode
    ? (
        <DateTimePicker
          value={draft}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={mode === 'date' ? new Date() : undefined}
          is24Hour
          themeVariant="light"
          onChange={(event, selected) => {
            if (event.type === 'dismissed') {
              setMode(null);
            } else if (selected) {
              if (Platform.OS === 'ios') {
                setDraft(selected);
              } else {
                select(selected);
              }
            }
          }}
        />
      )
    : null;

  return (
    <View className="flex-row gap-[10px]">
      {Platform.OS === 'web'
        ? (
            <>
              <TextInput
                className={INPUT_CLASS}
                value={date}
                onChangeText={value => onChange({ date: value })}
                placeholder="YYYY-MM-DD"
                accessibilityLabel="日期"
                editable={!disabled}
              />
              <TextInput
                className={INPUT_CLASS}
                value={time}
                onChangeText={value => onChange({ time: value })}
                placeholder="HH:mm（可选）"
                accessibilityLabel="时间"
                editable={!disabled}
              />
            </>
          )
        : (
            <>
              <Pressable
                className={INPUT_CLASS}
                onPress={() => openPicker('date')}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`选择日期，当前 ${date}`}
              >
                <Text className="text-[14px] text-[#292D29]">{date}</Text>
              </Pressable>
              <Pressable
                className={INPUT_CLASS}
                onPress={() => openPicker('time')}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`选择时间，当前 ${time || '未填写'}`}
              >
                <Text className="text-[14px] text-[#292D29]">{time || '选择时间'}</Text>
              </Pressable>
            </>
          )}
      {Platform.OS === 'ios'
        ? (
            <Modal transparent visible={mode !== null} animationType="slide" onRequestClose={() => setMode(null)}>
              <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(38, 49, 40, 0.22)' }}>
                <View className="rounded-t-[16px] bg-[#FFFDF9] pb-[32px]">
                  <View className="flex-row items-center justify-between px-6 py-4">
                    <Pressable onPress={() => setMode(null)} accessibilityRole="button" hitSlop={10}>
                      <Text className="text-[16px] text-[#898C86]">取消</Text>
                    </Pressable>
                    <Text className="text-[16px] font-semibold text-[#292D29]">{mode === 'date' ? '选择日期' : '选择时间'}</Text>
                    <Pressable onPress={() => select(draft)} accessibilityRole="button" hitSlop={10}>
                      <Text className="text-[16px] font-semibold text-[#5F834B]">确定</Text>
                    </Pressable>
                  </View>
                  {picker}
                </View>
              </View>
            </Modal>
          )
        : picker}
    </View>
  );
}
