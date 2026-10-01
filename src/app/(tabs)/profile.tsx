import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MyPostCard } from '@/components/profile/my-post-card';
import { ProfileHeader } from '@/components/profile/profile-header';
import { getProfileStats, queryItems } from '@/features/items/item-query';
import { useItems } from '@/features/items/items-context';

export default function ProfileScreen() {
  const { items, currentUserId, markResolved, deleteItem, refreshing, refresh, error } = useItems();
  const posts = queryItems(items, { ownerId: currentUserId });
  const stats = getProfileStats(items, currentUserId);
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const perform = async (operation: () => Promise<unknown>) => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    setBusy(true);
    setActionError(null);
    try {
      await operation();
    } catch (failure) {
      setActionError(failure instanceof Error ? failure.message : '操作失败，请重试');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  const openDetail = (id: string) => {
    router.push({ pathname: '/detail/[id]', params: { id } });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F8F4ED]">
      <FlatList
        className="flex-1"
        data={posts}
        refreshing={refreshing}
        onRefresh={() => void refresh()}
        keyExtractor={post => post.id}
        ListHeaderComponent={(
          <>
            <ProfileHeader stats={stats} />
            {actionError || error
              ? <Text className="px-[18px] pb-3 text-[#9E534F]" accessibilityRole="alert">{actionError || error}</Text>
              : null}
          </>
        )}
        renderItem={({ item }) => (
          <View className="px-[18px]">
            <MyPostCard
              item={item}
              disabled={busy}
              onEdit={() => {}}
              onViewDetail={() => openDetail(item.id)}
              onMarkReturned={() => void perform(() => markResolved(item.id))}
              onDelete={() => void perform(() => deleteItem(item.id))}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[10px]" />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text className="p-8 text-center text-[#858A85]">还没有发布信息</Text>}
      />
    </SafeAreaView>
  );
}
