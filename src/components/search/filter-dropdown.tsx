import { Pressable, Text } from 'react-native';

import { ChevronDownIcon } from '@/components/icons/lucide-icons';

type FilterDropdownProps = {
  value: string;
  onPress: () => void;
  accessibilityLabel: string;
};

export function FilterDropdown({ value, onPress, accessibilityLabel }: FilterDropdownProps) {
  return (
    <Pressable
      className="h-[38px] flex-1 flex-row items-center justify-between rounded-[9px] border border-[#E9E2D8] bg-[#FFFDF9] pl-[11px] pr-[6px]"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: value }}
    >
      <Text className="text-[13px] text-[#626760]" numberOfLines={1}>
        {value}
      </Text>
      <ChevronDownIcon size={16} color="#7A7E77" strokeWidth={1.8} />
    </Pressable>
  );
}
