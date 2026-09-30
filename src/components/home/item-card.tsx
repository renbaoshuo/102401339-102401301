import { Image, Text, View } from 'react-native';

import { CalendarDaysIcon, MapPinIcon } from '@/components/icons/lucide-icons';
import { ITEM_TYPE_LABEL, type CampusItem } from '@/data/mock-items';

const BADGE_STYLE: Record<CampusItem['type'], { bg: string; text: string }> = {
  lost: { bg: '#F4D2CD', text: '#9E534F' },
  found: { bg: '#F8DFA5', text: '#786234' },
};

export function ItemCard({ item }: { item: CampusItem }) {
  const badge = BADGE_STYLE[item.type];
  return (
    <View className="flex-row rounded-[14px] bg-[#FFFDF9] p-[5px]">
      <Image
        source={item.image}
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
              {ITEM_TYPE_LABEL[item.type]}
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
    </View>
  );
}
