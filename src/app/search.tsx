import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Keyboard, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterTabs, type HomeFilter } from '@/components/home/filter-tabs';
import { ChevronLeftIcon } from '@/components/icons/lucide-icons';
import { FilterDropdown } from '@/components/search/filter-dropdown';
import { FilterPanel } from '@/components/search/filter-panel';
import { SearchEmptyState } from '@/components/search/search-empty-state';
import { SearchInput } from '@/components/search/search-input';
import { SearchResultCard } from '@/components/search/search-result-card';
import {
  SORT_OPTIONS,
  queryItems,
  type AreaOption,
  type SortOption,
  type TimeOption,
} from '@/features/items/item-query';
import { useItems } from '@/features/items/items-context';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const initialQuery = typeof params.q === 'string' ? params.q : '';

  const [query, setQuery] = useState(initialQuery);
  const [keyword, setKeyword] = useState(initialQuery);
  const [filter, setFilter] = useState<HomeFilter>('all');
  const [area, setArea] = useState<AreaOption>('全部区域');
  const [time, setTime] = useState<TimeOption>('全部时间');
  const [sort, setSort] = useState<SortOption>('默认排序');
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const { items, refreshing, refresh, error } = useItems();

  const results = useMemo(() => queryItems(items, {
    keyword, type: filter, area, time, sort,
  }), [items, keyword, filter, area, time, sort]);

  const submit = () => {
    setKeyword(query);
    Keyboard.dismiss();
  };

  const cycleSort = () => {
    setSort(SORT_OPTIONS[(SORT_OPTIONS.indexOf(sort) + 1) % SORT_OPTIONS.length]);
  };

  const clearAll = () => {
    setQuery('');
    setKeyword('');
    setFilter('all');
    setArea('全部区域');
    setTime('全部时间');
    setSort('默认排序');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F8F4ED]">
      <View className="flex-1">
        <View className="h-[44px] flex-row items-center px-[19px]">
          <Pressable
            className="size-[24px] items-center justify-center"
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="返回"
          >
            <ChevronLeftIcon size={24} color="#292D29" strokeWidth={2.1} />
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-[20px] font-semibold text-[#292D29]">搜索</Text>
          </View>
          <View className="size-[24px]" />
        </View>
        <SearchInput value={query} onChangeText={setQuery} onSubmit={submit} />
        <FilterTabs variant="search" value={filter} onChange={setFilter} />
        <View
          className="mx-[18px] mt-[17px] flex-row gap-[12px]"
          onLayout={(event) => {
            setPanelTop(event.nativeEvent.layout.y + event.nativeEvent.layout.height);
          }}
        >
          <FilterDropdown
            value={area}
            onPress={() => setPanelOpen(true)}
            accessibilityLabel="选择区域"
          />
          <FilterDropdown
            value={time}
            onPress={() => setPanelOpen(true)}
            accessibilityLabel="选择时间范围"
          />
          <FilterDropdown
            value={sort}
            onPress={cycleSort}
            accessibilityLabel="选择排序方式"
          />
        </View>
        <FlatList
          className="mt-[18px] flex-1"
          data={results}
          refreshing={refreshing}
          onRefresh={() => void refresh()}
          ListFooterComponent={error ? <Text className="p-4 text-center text-[#9E534F]">{error}</Text> : null}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SearchResultCard
              item={item}
              onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id } })}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-[6px]" />}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={<SearchEmptyState onClear={clearAll} />}
        />
        {panelOpen
          ? (
              <View className="absolute inset-x-0 bottom-0" style={{ top: panelTop }}>
                <Pressable
                  className="absolute inset-0"
                  style={{ backgroundColor: 'rgba(38, 49, 40, 0.22)' }}
                  onPress={() => setPanelOpen(false)}
                  accessibilityLabel="关闭筛选"
                />
                <FilterPanel
                  area={area}
                  time={time}
                  onAreaChange={setArea}
                  onTimeChange={setTime}
                  onConfirm={() => setPanelOpen(false)}
                />
              </View>
            )
          : null}
      </View>
    </SafeAreaView>
  );
}
