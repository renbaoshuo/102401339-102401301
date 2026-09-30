import { Pressable, Text, TextInput, View } from 'react-native';

import { SearchIcon } from '@/components/icons/lucide-icons';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
};

export function SearchInput({ value, onChangeText, onSubmit }: SearchInputProps) {
  return (
    <View className="mx-[18px] h-[55px] flex-row items-center rounded-[17px] border border-[#E9E2D8] bg-[#FFFDF9] pl-[14px]">
      <SearchIcon size={19} color="#898C86" strokeWidth={2} />
      <TextInput
        className="ml-[9px] flex-1 text-[16px] text-[#292D29]"
        placeholder="搜索物品、地点或关键词..."
        placeholderTextColor="#898C86"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        underlineColorAndroid="transparent"
      />
      <Pressable
        className="mr-[5px] h-[45px] w-[87px] items-center justify-center rounded-[14px] bg-[#5F834B]"
        onPress={onSubmit}
        accessibilityRole="button"
        accessibilityLabel="搜索"
        hitSlop={4}
      >
        <Text className="text-[16px] font-semibold text-[#FFFDF9]">搜索</Text>
      </Pressable>
    </View>
  );
}
