import { Image, Pressable, Text, View } from 'react-native';

import { SettingsIcon } from '@/components/icons/lucide-icons';
import { PROFILE } from '@/data/profile';
import type { getProfileStats } from '@/features/items/item-query';

export function ProfileHeader({ stats }: { stats: ReturnType<typeof getProfileStats> }) {
  const displayStats = [
    { value: stats.published, label: '我发布的' },
    { value: stats.resolved, label: '已完成' },
    { value: stats.active, label: '进行中' },
  ];
  return (
    <View>
      <View className="items-end pr-[28px] pt-[15px]">
        <Pressable
          className="size-[24px] items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="设置"
          hitSlop={8}
        >
          <SettingsIcon size={24} color="#292D29" strokeWidth={1.8} />
        </Pressable>
      </View>
      <View className="flex-row pl-[37px] pt-[13px]">
        <Image source={PROFILE.avatar} className="rounded-full bg-[#EBD9B4]" style={{ width: 86, height: 86 }} />
        <View className="ml-[16px] justify-center pt-[10px]">
          <Text className="text-[24px] font-bold leading-[32px] text-[#292D29]">{PROFILE.name}</Text>
          <Text className="mt-[5px] text-[14px] leading-[20px] text-[#898C86]">{PROFILE.tagline}</Text>
        </View>
      </View>
      <View className="mt-[30px] flex-row px-[19px]">
        {displayStats.map(stat => (
          <View key={stat.label} className="flex-1 items-center">
            <Text className="text-[20px] font-bold leading-[28px] text-[#292D29]">{stat.value}</Text>
            <Text className="mt-[3px] text-[13px] leading-[18px] text-[#898C86]">{stat.label}</Text>
          </View>
        ))}
      </View>
      <View className="mt-[24px] h-[54px] justify-center bg-[#FFFDF9] pl-[24px]">
        <Text className="text-[17px] font-bold text-[#292D29]">我的发布</Text>
      </View>
      <View className="h-[15px]" />
    </View>
  );
}
