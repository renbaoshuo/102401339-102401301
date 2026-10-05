import { Image, Pressable, Text, View } from 'react-native';

import { CircleCheckIcon } from '@/components/icons/lucide-icons';
import { getItemImageSource } from '@/features/items/item-images';
import { ITEM_KIND_LABEL } from '@/features/items/item-presentation';
import type { CampusItem } from '@/features/items/item';

type PublishSuccessProps = {
  item: CampusItem;
  onViewDetail: () => void;
  onBackHome: () => void;
  variant?: 'publish' | 'edit';
};

export function PublishSuccess({ item, onViewDetail, onBackHome, variant = 'publish' }: PublishSuccessProps) {
  const editing = variant === 'edit';
  const actionLabel = editing ? '查看我的发布' : '查看刚发布的信息';
  return (
    <View className="flex-1 bg-[#F8F4ED]">
      <View className="h-[52px] items-center justify-center">
        <Text className="text-[20px] font-semibold text-[#292D29]">{editing ? '编辑成功' : '发布成功'}</Text>
      </View>
      <View className="flex-1 items-center px-[24px]">
        <View className="mt-[86px] size-[148px] items-center justify-center rounded-full bg-[#E6EFDF]">
          <View className="size-[108px] items-center justify-center rounded-full bg-[#FFFDF9]">
            <CircleCheckIcon size={44} color="#5F834B" strokeWidth={2} />
          </View>
        </View>
        <Text className="mt-[38px] text-[26px] font-bold text-[#292D29]">{editing ? '修改已保存' : '发布成功！'}</Text>
        <Text className="mt-[14px] text-center text-[15px] leading-[27px] text-[#898C86]">
          {editing
            ? `这条${ITEM_KIND_LABEL[item.type]}信息已更新\n其他同学现在可以看到最新内容`
            : `你的${ITEM_KIND_LABEL[item.type]}信息已发布\n其他同学现在可以看到这条信息`}
        </Text>
        <View className="mt-[55px] h-[112px] w-full flex-row items-center rounded-[16px] bg-[#FFFDF9] pl-[13px]">
          <Image
            source={getItemImageSource(item)}
            className="size-[82px] rounded-[10px] bg-[#E9E1D5]"
            resizeMode="contain"
          />
          <View className="ml-[15px] flex-1 pr-[16px]">
            <Text numberOfLines={1} className="text-[17px] font-bold text-[#292D29]">
              {item.title}
            </Text>
            <Text className="mt-[8px] text-[13px] text-[#898C86]">
              {`${ITEM_KIND_LABEL[item.type]}信息 · ${editing ? '刚刚更新' : '刚刚发布'}`}
            </Text>
          </View>
        </View>
        <Pressable
          className="mt-[56px] h-[55px] w-full items-center justify-center rounded-[27px] bg-[#5F834B]"
          onPress={onViewDetail}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text className="text-[17px] font-semibold text-[#FFFDF9]">{actionLabel}</Text>
        </Pressable>
        <Pressable
          className="mt-[26px] pb-[16px]"
          onPress={onBackHome}
          accessibilityRole="button"
          accessibilityLabel="返回首页"
        >
          <Text className="text-[14px] font-semibold text-[#5F834B]">返回首页</Text>
        </Pressable>
      </View>
    </View>
  );
}
