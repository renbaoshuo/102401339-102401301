import { Pressable, Text, View } from 'react-native';

import { SearchIcon } from '@/components/icons/lucide-icons';

export function SearchEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <View className="items-center pt-[74px]">
      <View className="size-[154px] items-center justify-center rounded-full bg-[#EAF0E4]">
        <SearchIcon size={80} color="#5F834B" strokeWidth={1.5} />
      </View>
      <Text className="mt-[27px] text-[21px] font-semibold text-[#292D29]">暂时没有找到相关物品</Text>
      <Text className="mt-[8px] text-[14px] text-[#898C86]">试试更短的关键词，或扩大区域范围</Text>
      <Pressable
        className="mt-[28px] h-[44px] w-[164px] items-center justify-center rounded-[17px] bg-[#5F834B]"
        onPress={onClear}
        accessibilityRole="button"
      >
        <Text className="text-[15px] font-semibold text-[#FFFDF9]">清除筛选</Text>
      </Pressable>
    </View>
  );
}
