import { Image, Pressable, Text, View } from 'react-native';

import { CalendarDaysIcon, MapPinIcon } from '@/components/icons/lucide-icons';
import type { CampusItem } from '@/features/items/item';
import { getItemImageSource } from '@/features/items/item-images';
import { getItemStatusLabel, getItemStatusStyle } from '@/features/items/item-presentation';

type ItemCardProps = {
  item: CampusItem;
  onPress?: () => void;
};

export function ItemCard({ item, onPress }: ItemCardProps) {
  const badge = getItemStatusStyle(item);
  return (
    <Pressable
      className="flex-row rounded-[14px] bg-[#FFFDF9] p-[5px]"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}，${getItemStatusLabel(item)}，${item.location}`}
    >
      <Image
        source={getItemImageSource(item)}
        className="h-[81px] w-[102px] rounded-[12px] bg-[#F0E4DA]"
        resizeMode="contain"
      />
      <View className="flex-1 pl-[17px] pr-[12px] pt-[13px]">
        <View className="flex-row items-center justify-between">
          <Text numberOfLines={1} className="shrink text-[18px] font-semibold text-[#292D29]">
            {item.title}
          </Text>
          <View
            className="ml-2 h-[28px] shrink-0 items-center justify-center rounded-[13px] px-[13px]"
            style={{ backgroundColor: badge.bg }}
          >
            <Text className="text-[13px] font-semibold" style={{ color: badge.text }}>
              {getItemStatusLabel(item)}
            </Text>
          </View>
        </View>
        <View className="mt-[9px] flex-row items-center gap-[7px]">
          <MapPinIcon size={19} color="#898C86" strokeWidth={1.9} />
          <Text className="text-[13px] text-[#898C86]" numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View className="mt-[3px] flex-row items-center gap-[7px]">
          <CalendarDaysIcon size={19} color="#898C86" strokeWidth={1.9} />
          <Text className="text-[13px] text-[#898C86]">{item.date}</Text>
        </View>
      </View>
    </Pressable>
  );
}
