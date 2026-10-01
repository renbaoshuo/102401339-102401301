import { Image, Pressable, Text, View } from 'react-native';

import { MapPinIcon } from '@/components/icons/lucide-icons';
import type { CampusItem } from '@/features/items/item';
import { getItemImageSource, getItemThumbTint } from '@/features/items/item-images';
import { getItemStatusLabel, getItemStatusStyle } from '@/features/items/item-presentation';

type MyPostCardProps = {
  item: CampusItem;
  disabled?: boolean;
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

export function MyPostCard({ item, disabled, onEdit, onMarkReturned, onViewDetail, onDelete }: MyPostCardProps) {
  const badge = getItemStatusStyle(item);

  const primary: CardAction = item.status === 'resolved'
    ? { label: '查看详情', onPress: onViewDetail }
    : { label: '编辑', onPress: onEdit };

  const secondary: CardAction = item.status === 'active'
    ? { label: item.type === 'lost' ? '改为已找回' : '改为已归还', accent: true, onPress: onMarkReturned }
    : { label: '删除', onPress: onDelete };

  return (
    <View className="h-[108px] flex-row rounded-[15px] bg-[#FFFDF9] pl-[7px]">
      <Image
        source={getItemImageSource(item)}
        className="h-[71px] w-[91px] self-center rounded-[8px]"
        style={{ backgroundColor: getItemThumbTint(item) }}
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
              {getItemStatusLabel(item)}
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
          <ActionButton label={primary.label} onPress={primary.onPress} width={103} disabled={disabled} />
          <ActionButton
            label={secondary.label}
            accent={secondary.accent}
            onPress={secondary.onPress}
            width={121}
            disabled={disabled}
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
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  width: number;
  accent?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      className="h-[28px] items-center justify-center rounded-[14px] border border-[#CFC8BE] bg-[#FFFDF9]"
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      style={{ opacity: disabled ? 0.5 : 1, width }}
      accessibilityRole="button"
    >
      <Text className={`text-[13px] font-medium ${accent ? 'text-[#5F834B]' : 'text-[#292D29]'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
