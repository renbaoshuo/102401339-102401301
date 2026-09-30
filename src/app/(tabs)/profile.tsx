import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MyPostCard } from '@/components/profile/my-post-card';
import { ProfileHeader } from '@/components/profile/profile-header';
import { MY_POSTS } from '@/data/my-posts';

export default function ProfileScreen() {
  const [posts, setPosts] = useState(MY_POSTS);

  const markReturned = (id: string) => {
    setPosts(prev => prev.map(post => (post.id === id ? { ...post, status: 'returned' as const } : post)));
  };

  const remove = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F8F4ED]">
      <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={post => post.id}
        ListHeaderComponent={<ProfileHeader />}
        renderItem={({ item }) => (
          <View className="px-[18px]">
            <MyPostCard
              item={item}
              onEdit={() => {}}
              onViewDetail={() => {}}
              onMarkReturned={() => markReturned(item.id)}
              onDelete={() => remove(item.id)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[10px]" />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
