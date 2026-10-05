import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronLeftIcon, ImagePlusIcon } from '@/components/icons/lucide-icons';
import { ItemDateTimeFields } from '@/components/profile/item-date-time-fields';
import { PublishSuccess } from '@/components/publish/publish-success';
import type { CampusItem, ItemContent } from '@/features/items/item';
import { getItemImageSource } from '@/features/items/item-images';
import { ITEM_KIND_LABEL } from '@/features/items/item-presentation';
import { useItems } from '@/features/items/items-context';

const INPUT_CLASS = 'min-h-[44px] rounded-[10px] border border-[#E9E2D8] bg-[#F1EBE3] px-[15px] text-[14px] text-[#292D29]';

function FieldLabel({ children }: { children: string }) {
  return <Text className="mb-[8px] text-[14px] font-semibold text-[#292D29]">{children}</Text>;
}

export function ItemEditForm({ item }: { item: CampusItem }) {
  const { updateItem } = useItems();
  const [draft, setDraft] = useState<ItemContent>(() => ({
    title: item.title,
    date: item.date,
    time: item.time,
    location: item.location,
    locationDetail: item.locationDetail,
    description: item.description,
    contact: item.contact,
    imageAssetKey: item.imageAssetKey,
    imageUri: item.imageUri,
  }));
  const [hint, setHint] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [picking, setPicking] = useState(false);
  const [saved, setSaved] = useState<CampusItem | null>(null);
  const pending = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const busy = submitting || picking;
  const hasImage = Boolean(draft.imageAssetKey || draft.imageUri);

  const change = (patch: Partial<ItemContent>) => setDraft(previous => ({ ...previous, ...patch }));
  const showHint = (message: string) => {
    setHint(message);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const pickImage = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    setPicking(true);
    setHint(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        base64: Platform.OS === 'web',
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // 网页图片存为 data URI，避免刷新后临时 blob URL 失效。
        const imageUri = asset.base64
          ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;
        change({ imageUri, imageAssetKey: null });
      }
    } catch (_failure) {
      showHint('无法选择图片，请重试');
    } finally {
      pending.current = false;
      setPicking(false);
    }
  };

  const submit = async () => {
    if (pending.current) {
      return;
    }
    Keyboard.dismiss();
    pending.current = true;
    setSubmitting(true);
    setHint(null);
    try {
      setSaved(await updateItem(item.id, draft));
    } catch (failure) {
      showHint(failure instanceof Error ? failure.message : '保存失败，请重试');
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  };

  const back = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile');

  if (saved) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F4ED]">
        <PublishSuccess
          variant="edit"
          item={saved}
          onViewDetail={() => router.dismissTo('/(tabs)/profile')}
          onBackHome={() => router.dismissTo('/(tabs)')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F4ED]">
      <View className="h-[52px] flex-row items-center justify-center px-[18px]">
        <Pressable
          className="absolute left-[18px] size-[44px] items-center justify-center"
          onPress={back}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="返回"
        >
          <ChevronLeftIcon size={24} color="#292D29" strokeWidth={2.1} />
        </Pressable>
        <Text className="text-[20px] font-semibold text-[#292D29]">编辑信息</Text>
      </View>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View className="mx-[18px] mt-[12px] h-[44px] items-center justify-center rounded-[22px] bg-[#E7EFE1]">
            <Text className="text-[17px] font-semibold text-[#5F834B]">{ITEM_KIND_LABEL[item.type]}信息</Text>
          </View>
          <View className="mt-[18px] gap-[18px] px-[38px]">
            <View>
              <FieldLabel>物品名称</FieldLabel>
              <TextInput
                className={INPUT_CLASS}
                value={draft.title}
                onChangeText={title => change({ title })}
                accessibilityLabel="物品名称"
                editable={!busy}
                returnKeyType="done"
              />
            </View>
            <View>
              <FieldLabel>{item.type === 'lost' ? '丢失时间' : '捡到时间'}</FieldLabel>
              <ItemDateTimeFields date={draft.date} time={draft.time} disabled={busy} onChange={change} />
            </View>
            <View>
              <FieldLabel>{item.type === 'lost' ? '丢失地点' : '捡到地点'}</FieldLabel>
              <TextInput
                className={INPUT_CLASS}
                value={draft.location}
                onChangeText={location => change({ location })}
                accessibilityLabel="地点"
                editable={!busy}
              />
            </View>
            <View>
              <FieldLabel>详细地点</FieldLabel>
              <TextInput
                className={INPUT_CLASS}
                value={draft.locationDetail}
                onChangeText={locationDetail => change({ locationDetail })}
                placeholder="如：三楼自习区（可选）"
                placeholderTextColor="#A6A49F"
                accessibilityLabel="详细地点"
                editable={!busy}
              />
            </View>
            <View>
              <FieldLabel>物品描述</FieldLabel>
              <TextInput
                className={`${INPUT_CLASS} min-h-[90px] py-[10px]`}
                value={draft.description}
                onChangeText={description => change({ description })}
                accessibilityLabel="物品描述"
                editable={!busy}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View>
              <FieldLabel>联系方式</FieldLabel>
              <TextInput
                className={INPUT_CLASS}
                value={draft.contact}
                onChangeText={contact => change({ contact })}
                accessibilityLabel="联系方式"
                editable={!busy}
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>
            <View>
              <FieldLabel>物品图片</FieldLabel>
              <View className="flex-row flex-wrap items-center gap-[16px]">
                {hasImage
                  ? (
                      <View>
                        <Image
                          source={getItemImageSource({ ...item, ...draft })}
                          className="size-[109px] rounded-[13px] bg-[#E9E1D5]"
                          style={{ width: 109, height: 109 }}
                          resizeMode="contain"
                        />
                        <Pressable
                          className="absolute -right-[6px] -top-[6px] size-[24px] items-center justify-center rounded-full bg-[#292D29]"
                          onPress={() => change({ imageAssetKey: null, imageUri: null })}
                          disabled={busy}
                          accessibilityRole="button"
                          accessibilityLabel="移除图片"
                          hitSlop={8}
                        >
                          <Text className="text-[15px] text-[#FFFDF9]">×</Text>
                        </Pressable>
                      </View>
                    )
                  : null}
                <Pressable
                  className="size-[109px] items-center justify-center rounded-[13px]"
                  style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#BDB9AF' }}
                  onPress={() => void pickImage()}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel={hasImage ? '替换图片' : '添加图片'}
                >
                  <ImagePlusIcon size={30} color="#898C86" strokeWidth={1.6} />
                  <Text className="mt-[8px] text-[13px] text-[#898C86]">
                    {picking ? '选择中…' : hasImage ? '替换图片' : '添加图片'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
          {hint
            ? (
                <View className="mx-[18px] mt-[20px] rounded-[12px] bg-[#FFF4F1] px-4 py-3">
                  <Text className="text-center text-[13px] text-[#A65D51]" accessibilityRole="alert">{hint}</Text>
                </View>
              )
            : null}
          <Pressable
            className={`mx-[18px] mt-[24px] h-[54px] items-center justify-center rounded-[27px] bg-[#5F834B] ${busy ? 'opacity-60' : ''}`}
            onPress={() => void submit()}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="保存修改"
            accessibilityState={{ disabled: busy, busy: submitting }}
          >
            <Text className="text-[18px] font-semibold text-[#FFFDF9]">{submitting ? '保存中…' : '保存修改'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
