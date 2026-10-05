import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronLeftIcon } from '@/components/icons/lucide-icons';
import { ItemEditForm } from '@/components/profile/item-edit-form';
import { useItem, useItems } from '@/features/items/items-context';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useItem(id);
  const { currentUserId } = useItems();

  if (item && item.ownerId === currentUserId) {
    return <ItemEditForm key={item.id} item={item} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F4ED]">
      <View className="h-[52px] justify-center px-[19px]">
        <Pressable
          className="size-[44px] items-center justify-center"
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile')}
          accessibilityRole="button"
          accessibilityLabel="返回"
        >
          <ChevronLeftIcon size={24} color="#292D29" strokeWidth={2.1} />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-[15px] text-[#575C56]" accessibilityRole="alert">
          {item ? '只能编辑自己发布的信息' : '该信息已被删除或不存在'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
