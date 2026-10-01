import { Pressable, Text, View } from 'react-native';

import { AREA_OPTIONS, TIME_OPTIONS, type AreaOption, type TimeOption } from '@/features/items/item-query';

type FilterPanelProps = {
  area: AreaOption;
  time: TimeOption;
  onAreaChange: (area: AreaOption) => void;
  onTimeChange: (time: TimeOption) => void;
  onConfirm: () => void;
};

export function FilterPanel({ area, time, onAreaChange, onTimeChange, onConfirm }: FilterPanelProps) {
  return (
    <View className="mx-[18px] rounded-[16px] bg-[#FFFDF9] pb-[8px] pt-[20px]">
      <Text className="ml-[21px] text-[17px] font-bold text-[#292D29]">按区域筛选</Text>
      <View className="mx-[21px] mt-[15px] flex-row flex-wrap gap-x-[10px] gap-y-[15px]">
        {AREA_OPTIONS.map((option) => {
          const active = option === area;
          return (
            <Pressable
              key={option}
              className={`h-[40px] w-[100px] items-center justify-center rounded-[11px] ${active ? 'border border-[#5F834B] bg-[#E7EFE1]' : 'bg-[#F5F1EB]'}`}
              onPress={() => onAreaChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <Text
                className={`text-[13px] ${active ? 'font-semibold text-[#5F834B]' : 'text-[#292D29]'}`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View className="mx-[21px] mt-[25px] h-[1px] bg-[#E9E2D8]" />
      <Text className="ml-[21px] mt-[14px] text-[14px] font-semibold text-[#292D29]">时间范围</Text>
      <View className="ml-[21px] mt-[16px] flex-row gap-[16px]">
        {TIME_OPTIONS.map((option) => {
          const active = option === time;
          return (
            <Pressable
              key={option}
              onPress={() => onTimeChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              hitSlop={4}
            >
              <Text className={`text-[13px] ${active ? 'font-semibold text-[#5F834B]' : 'text-[#898C86]'}`}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        className="mr-[21px] mt-[10px] h-[38px] w-[124px] items-center justify-center self-end rounded-[14px] bg-[#5F834B]"
        onPress={onConfirm}
        accessibilityRole="button"
        accessibilityLabel="查看结果"
      >
        <Text className="text-[14px] font-semibold text-[#FFFDF9]">查看结果</Text>
      </Pressable>
    </View>
  );
}
