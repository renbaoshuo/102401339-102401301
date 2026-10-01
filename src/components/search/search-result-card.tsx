import { Image, Pressable, Text, View } from 'react-native';

import { CalendarDaysIcon, MapPinIcon } from '@/components/icons/lucide-icons';
import type { CampusItem } from '@/features/items/item';
import { getItemImageSource } from '@/features/items/item-images';
import { getItemStatusLabel, getItemStatusStyle } from '@/features/items/item-presentation';

type SearchResultCardProps = {
  item: CampusItem;
  onPress?: () => void;
};

export function SearchResultCard({ item, onPress }: SearchResultCardProps) {
  const badge = getItemStatusStyle(item);
  return (
    <Pressable
      className="h-[105px] flex-row rounded-[15px] bg-[#FFFDF9]"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}，${getItemStatusLabel(item)}，${item.location}`}
    >
      <Image
        source={getItemImageSource(item)}
        className="ml-[6px] h-[71px] w-[91px] self-center rounded-[8px] bg-[#D9C6A8]"
        resizeMode="contain"
      />
      <View className="flex-1 pl-[7px] pr-[13px] pt-[14px]">
        <View className="flex-row items-center justify-between">
          <Text numberOfLines={1} className="ml-[6px] shrink text-[18px] font-semibold text-[#292D29]">
            {item.title}
          </Text>
          <View
            className="ml-2 h-[28px] shrink-0 items-center justify-center rounded-[13px] px-[11px]"
            style={{ backgroundColor: badge.bg }}
          >
            <Text className="text-[13px] font-semibold" style={{ color: badge.text }}>
              {getItemStatusLabel(item)}
            </Text>
          </View>
        </View>
        <View className="mt-[11px] gap-[5px]">
          <View className="flex-row items-center gap-[7px]">
            <MapPinIcon size={20} color="#898C86" strokeWidth={2} />
            <Text className="text-[13px] text-[#898C86]" numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View className="flex-row items-center gap-[7px]">
            <CalendarDaysIcon size={20} color="#898C86" strokeWidth={2} />
            <Text className="text-[13px] text-[#898C86]">{item.date}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
