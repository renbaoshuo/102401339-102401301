import { router } from 'expo-router';
import { Pressable, TextInput, View } from 'react-native';

import { SearchIcon } from '@/components/icons/lucide-icons';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
};

export function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  const openSearch = () => {
    onSubmit();
    router.push(value.trim() ? { pathname: '/search', params: { q: value.trim() } } : '/search');
  };

  return (
    <View className="mx-[18px] h-[55px] flex-row items-center rounded-full bg-[#FFFDF9] pl-[24px]">
      <SearchIcon size={21} color="#898C86" strokeWidth={2.1} />
      <TextInput
        className="ml-[15px] flex-1 text-[15px] text-[#292D29]"
        placeholder="搜索物品、地点或关键词..."
        placeholderTextColor="#898C86"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={openSearch}
        returnKeyType="search"
        underlineColorAndroid="transparent"
      />
      <Pressable
        className="mr-[5px] size-[46px] items-center justify-center rounded-full bg-[#5F834B]"
        onPress={openSearch}
        accessibilityRole="button"
        accessibilityLabel="搜索"
        hitSlop={4}
      >
        <SearchIcon size={22} color="#FFFDF9" strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}
