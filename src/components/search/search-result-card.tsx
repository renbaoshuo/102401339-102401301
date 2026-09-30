import { Image, Pressable, Text, View } from 'react-native';

import { CalendarDaysIcon, MapPinIcon } from '@/components/icons/lucide-icons';
import { ITEM_TYPE_LABEL, type CampusItem } from '@/data/mock-items';

const BADGE_STYLE: Record<CampusItem['type'], { bg: string; text: string }> = {
  lost: { bg: '#F4D2CD', text: '#9E534F' },
  found: { bg: '#F8DFA5', text: '#786234' },
};

type SearchResultCardProps = {
  item: CampusItem;
  onPress?: () => void;
};

export function SearchResultCard({ item, onPress }: SearchResultCardProps) {
  const badge = BADGE_STYLE[item.type];
  return (
    <Pressable
      className="h-[105px] flex-row rounded-[15px] bg-[#FFFDF9]"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}，${ITEM_TYPE_LABEL[item.type]}，${item.location}`}
    >
      <Image
        source={item.image}
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
              {ITEM_TYPE_LABEL[item.type]}
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
