import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CopyToast } from '@/components/detail/copy-toast';
import { DetailBadge } from '@/components/detail/detail-badge';
import {
  ChevronLeftIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
} from '@/components/icons/lucide-icons';
import {
  ITEM_KIND_LABEL,
  ITEM_KIND_STYLE,
  getItemStatusLabel,
  getItemStatusStyle,
} from '@/features/items/item-presentation';
import type { CampusItem } from '@/features/items/item';
import { getItemImageSource } from '@/features/items/item-images';
import { useItem } from '@/features/items/items-context';

const HERO_IMAGE = require('@/assets/images/home/detail-hero.jpg');
// 设计稿 hero 区域 402x274
const HERO_RATIO = 402 / 274;

// 设计稿仅提供了蓝色校园卡的实拍 hero,其余物品用物品图衬在暖色底上
function ItemHero({ item }: { item: CampusItem }) {
  if (item.id === '2' && item.imageAssetKey === 'campus-card' && !item.imageUri) {
    return (
      <View style={{ width: '100%', aspectRatio: HERO_RATIO }}>
        <Image source={HERO_IMAGE} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
    );
  }
  return (
    <View style={{ width: '100%', aspectRatio: HERO_RATIO }} className="items-center justify-center bg-[#EDE4D6]">
      <Image source={getItemImageSource(item)} style={{ width: '72%', height: '78%' }} resizeMode="contain" />
    </View>
  );
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useItem(id);
  const insets = useSafeAreaInsets();

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
  }, []);

  const copyContact = async () => {
    if (!item) {
      return;
    }
    await Clipboard.setStringAsync(item.contact);
    setToastVisible(true);
    Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    hideTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true })
        .start(() => setToastVisible(false));
    }, 1800);
  };

  if (!item) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F8F4ED]">
        <View className="h-[52px] flex-row items-center px-[19px] pt-[8px]">
          <Pressable
            className="size-[24px] items-center justify-center"
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="返回"
          >
            <ChevronLeftIcon size={24} color="#292D29" strokeWidth={2.1} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-[15px] text-[#575C56]">未找到该物品信息</Text>
        </View>
      </SafeAreaView>
    );
  }

  const kind = ITEM_KIND_STYLE[item.type];
  const status = getItemStatusStyle(item);
  const timeLabel = item.type === 'found' ? '捡到时间' : '丢失时间';
  const placeLabel = item.type === 'found' ? '捡到地点' : '丢失地点';

  return (
    <View className="flex-1 bg-[#F8F4ED]">
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
        <View className="h-[52px] flex-row items-start px-[19px] pt-[8px]">
          <Pressable
            className="size-[24px] items-center justify-center"
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="返回"
          >
            <ChevronLeftIcon size={24} color="#292D29" strokeWidth={2.1} />
          </Pressable>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
          <ItemHero item={item} />
          <View className="flex-row items-center justify-between px-[24px] pt-[14px]">
            <Text className="shrink text-[22px] font-bold text-[#292D29]" numberOfLines={1}>
              {item.title}
            </Text>
            <View className="ml-3 flex-row gap-[13px]">
              <DetailBadge label={ITEM_KIND_LABEL[item.type]} bg={kind.bg} color={kind.text} />
              <DetailBadge label={getItemStatusLabel(item)} bg={status.bg} color={status.text} />
            </View>
          </View>
          <View className="mt-[23px] gap-[11px] px-[21px]">
            <View className="flex-row items-center">
              <ClockIcon size={20} color="#898C86" strokeWidth={2} />
              <Text className="ml-[11px] w-[99px] text-[14px] text-[#898C86]">{timeLabel}</Text>
              <Text className="flex-1 text-[14px] text-[#565A56]">
                {item.date}
                {' '}
                {item.time}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MapPinIcon size={20} color="#898C86" strokeWidth={2} />
              <Text className="ml-[11px] w-[99px] text-[14px] text-[#898C86]">{placeLabel}</Text>
              <Text className="flex-1 text-[14px] text-[#565A56]" numberOfLines={1}>
                {item.locationDetail}
              </Text>
            </View>
          </View>
          <View className="mx-[20px] mt-[22px] h-[1px] bg-[#E9E2D8]" />
          <Text className="mt-[21px] px-[24px] text-[16px] font-bold text-[#292D29]">物品描述</Text>
          <Text className="mt-[9px] px-[24px] text-[14px] leading-[26px] text-[#4B504B]">
            {item.description}
          </Text>
          <View className="mx-[20px] mt-[16px] h-[1px] bg-[#E9E2D8]" />
          <Text className="mt-[22px] px-[24px] text-[16px] font-bold text-[#292D29]">联系方式</Text>
          <View className="mt-[3px] h-[45px] flex-row items-center justify-between px-[24px]">
            <View className="flex-1 flex-row items-center">
              <PhoneIcon size={28} color="#292D29" strokeWidth={1.8} />
              <Text className="ml-[23px] text-[15px] font-semibold text-[#292D29]">
                {item.contact}
              </Text>
            </View>
            <Pressable
              className="h-[45px] w-[136px] items-center justify-center rounded-[16px] bg-[#5F834B]"
              onPress={copyContact}
              accessibilityRole="button"
              accessibilityLabel="复制联系方式"
            >
              <Text className="text-[14px] font-semibold text-[#FFFDF9]">复制联系方式</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
      {toastVisible ? <CopyToast opacity={toastOpacity} bottom={64 + insets.bottom} /> : null}
    </View>
  );
}
