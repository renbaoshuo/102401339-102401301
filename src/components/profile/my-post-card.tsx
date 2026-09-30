import { Image, Pressable, Text, View } from 'react-native';

import { MapPinIcon } from '@/components/icons/lucide-icons';
import {
  MY_POST_STATUS_LABEL,
  MY_POST_STATUS_STYLE,
  type MyPostItem,
} from '@/data/my-posts';

type MyPostCardProps = {
  item: MyPostItem;
  onEdit: () => void;
  onMarkReturned: () => void;
  onViewDetail: () => void;
  onDelete: () => void;
};

type CardAction = {
  label: string;
  accent?: boolean;
  onPress: () => void;
};

export function MyPostCard({ item, onEdit, onMarkReturned, onViewDetail, onDelete }: MyPostCardProps) {
  const badge = MY_POST_STATUS_STYLE[item.status];

  const primary: CardAction = item.status === 'returned'
    ? { label: '查看详情', onPress: onViewDetail }
    : { label: '编辑', onPress: onEdit };

  const secondary: CardAction = item.status === 'lost'
    ? { label: '改为已找回', accent: true, onPress: onMarkReturned }
    : item.status === 'found'
      ? { label: '查看详情', onPress: onViewDetail }
      : { label: '删除', onPress: onDelete };

  return (
    <View className="h-[108px] flex-row rounded-[15px] bg-[#FFFDF9] pl-[7px]">
      <Image
        source={item.image}
        className="h-[71px] w-[91px] self-center rounded-[8px]"
        style={{ backgroundColor: item.thumbTint }}
        resizeMode="contain"
      />
      <View className="flex-1 pl-[13px] pr-[16px] pt-[13px]">
        <View className="h-[28px] flex-row items-center justify-between">
          <Text numberOfLines={1} className="shrink text-[18px] font-semibold text-[#292D29]">
            {item.title}
          </Text>
          <View
            className="ml-2 h-[28px] w-[62px] shrink-0 items-center justify-center rounded-[13px]"
            style={{ backgroundColor: badge.bg }}
          >
            <Text className="text-[13px] font-semibold" style={{ color: badge.text }}>
              {MY_POST_STATUS_LABEL[item.status]}
            </Text>
          </View>
        </View>
        <View className="mt-[7px] flex-row items-center">
          <MapPinIcon size={20} color="#898C86" strokeWidth={1.7} />
          <Text className="ml-[7px] text-[12px] text-[#898C86]" numberOfLines={1}>
            {item.date}
            {'  '}
            {item.location}
          </Text>
        </View>
        <View className="mt-[6px] h-[28px] flex-row gap-[9px] pl-[6px]">
          <ActionButton label={primary.label} onPress={primary.onPress} width={103} />
          <ActionButton
            label={secondary.label}
            accent={secondary.accent}
            onPress={secondary.onPress}
            width={121}
          />
        </View>
      </View>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  width,
  accent = false,
}: {
  label: string;
  onPress: () => void;
  width: number;
  accent?: boolean;
}) {
  return (
    <Pressable
      className="h-[28px] items-center justify-center rounded-[14px] border border-[#CFC8BE] bg-[#FFFDF9]"
      style={{ width }}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text className={`text-[13px] font-medium ${accent ? 'text-[#5F834B]' : 'text-[#292D29]'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
