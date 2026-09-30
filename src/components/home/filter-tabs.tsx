import { Pressable, Text, View } from 'react-native';

import type { ItemType } from '@/data/mock-items';

export type HomeFilter = 'all' | ItemType;

const FILTERS: { key: HomeFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'lost', label: '寻物' },
  { key: 'found', label: '招领' },
];

type FilterTabsProps = {
  value: HomeFilter;
  onChange: (filter: HomeFilter) => void;
  variant?: 'home' | 'search';
};

export function FilterTabs({ value, onChange, variant = 'home' }: FilterTabsProps) {
  const isSearch = variant === 'search';
  return (
    <View
      className={isSearch
        ? 'mx-[18px] mt-[17px] h-[48px] flex-row gap-[3px] rounded-[15px] bg-[#EFE8DF] p-[3px]'
        : 'mx-[18px] mt-[13px] h-[42px] flex-row rounded-full bg-[#F1EADE] p-[2px]'}
    >
      {FILTERS.map((filter) => {
        const active = filter.key === value;
        return (
          <Pressable
            key={filter.key}
            className={isSearch
              ? 'flex-1 items-center justify-center rounded-[13px]'
              : 'flex-1 items-center justify-center rounded-full'}
            style={active ? { backgroundColor: '#5F834B' } : undefined}
            onPress={() => onChange(filter.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={`text-[16px] ${active ? 'font-semibold text-[#FFFDF9]' : 'font-medium text-[#292D29]'}`}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
