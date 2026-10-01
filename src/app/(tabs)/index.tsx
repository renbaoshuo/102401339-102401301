import { useMemo, useState } from 'react';
import { FlatList, Keyboard, Text, View } from 'react-native';
import { router } from 'expo-router';

import { FilterTabs, type HomeFilter } from '@/components/home/filter-tabs';
import { HeroBanner } from '@/components/home/hero-banner';
import { ItemCard } from '@/components/home/item-card';
import { SearchBar } from '@/components/home/search-bar';
import { queryItems } from '@/features/items/item-query';
import { useItems } from '@/features/items/items-context';

export default function HomeScreen() {
  const [filter, setFilter] = useState<HomeFilter>('all');
  const [query, setQuery] = useState('');
  const { items: allItems, refreshing, refresh, error } = useItems();

  const items = useMemo(() => queryItems(allItems, { type: filter, keyword: query }), [allItems, filter, query]);

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <View className="flex-1 bg-[#F8F4ED]">
      <FlatList
        className="flex-1"
        data={items}
        refreshing={refreshing}
        onRefresh={() => void refresh()}
        ListFooterComponent={error ? <Text className="p-4 text-center text-[#9E534F]">{error}</Text> : null}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="px-[16px]">
            <ItemCard item={item} onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id } })} />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[6px]" />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={(
          <>
            <HeroBanner />
            <View className="mt-[13px]">
              <SearchBar
                value={query}
                onChangeText={setQuery}
                onSubmit={dismissKeyboard}
              />
            </View>
            <FilterTabs value={filter} onChange={setFilter} />
            <View className="h-[7px]" />
          </>
        )}
        ListEmptyComponent={(
          <View className="items-center gap-[6px] pt-16">
            <Text className="text-[15px] font-medium text-[#575C56]">
              没有找到相关物品
            </Text>
            <Text className="text-[13px] text-[#898C86]">
              换个关键词或筛选条件试试吧
            </Text>
          </View>
        )}
      />
    </View>
  );
}
