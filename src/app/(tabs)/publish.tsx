import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AreaSheet } from '@/components/publish/area-sheet';
import { PublishSuccess } from '@/components/publish/publish-success';
import { ImagePlusIcon } from '@/components/icons/lucide-icons';
import { localDateString } from '@/features/items/item-query';
import { ITEM_KIND_LABEL } from '@/features/items/item-presentation';
import { useItems } from '@/features/items/items-context';
import type { CampusItem, ItemType } from '@/features/items/item';

const PUBLISH_STICKER = require('@/assets/images/home/publish-sticker.png');
const MAX_IMAGES = 9;

const INPUT_CLASS = 'h-[39px] rounded-[10px] border border-[#E9E2D8] bg-[#F1EBE3] pl-[15px] text-[14px] text-[#292D29]';
const PLACEHOLDER = '#A6A49F';

function FieldLabel({ children }: { children: string }) {
  return <Text className="mb-[8px] text-[14px] font-semibold text-[#292D29]">{children}</Text>;
}

export default function PublishScreen() {
  const { createItem } = useItems();
  const [mode, setMode] = useState<ItemType>('lost');
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [areaSheetOpen, setAreaSheetOpen] = useState(false);
  const [pickerStage, setPickerStage] = useState<'date' | 'time' | null>(null);
  const [draftDate, setDraftDate] = useState(() => new Date());
  const [hint, setHint] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState<CampusItem | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // 校验提示出现在表单底部,需滚到底部保证按钮可见可点
  const showHint = (message: string) => {
    setHint(message);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const pickImages = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages(previous => [...previous, ...result.assets.map(asset => asset.uri)].slice(0, MAX_IMAGES));
    }
  };

  const submit = async () => {
    Keyboard.dismiss();
    const missing = [
      !title.trim() && '物品名称',
      !dateTime && '时间',
      !location && '地点',
      !contact.trim() && '联系方式',
    ].filter(Boolean) as string[];
    if (missing.length > 0) {
      showHint(`还有 ${missing.length} 项必填内容需要完善`);
      return;
    }
    setHint(null);
    setSubmitting(true);
    try {
      const item = await createItem({
        type: mode,
        title,
        location,
        date: dateTime ? localDateString(dateTime.getTime()) : '',
        time: dateTime
          ? `${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`
          : '',
        description,
        contact,
        imageUri: images[0] ?? null,
      });
      setPublished(item);
    } catch (failure) {
      showHint(failure instanceof Error ? failure.message : '发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const leaveSuccess = () => {
    setPublished(null);
    setTitle('');
    setDateTime(null);
    setLocation('');
    setDescription('');
    setContact('');
    setImages([]);
    setHint(null);
  };

  if (published) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F8F4ED]">
        <PublishSuccess
          item={published}
          onViewDetail={() => {
            const { id } = published;
            leaveSuccess();
            router.push({ pathname: '/detail/[id]', params: { id } });
          }}
          onBackHome={() => {
            leaveSuccess();
            router.navigate('/(tabs)');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F8F4ED]">
      <View className="h-[52px] items-center justify-center">
        <Text className="text-[20px] font-semibold text-[#292D29]">发布信息</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="mx-[18px] h-[48px] flex-row gap-[3px] rounded-[24px] bg-[#EEE7DF] p-[3px]">
          {(['lost', 'found'] as const).map((option) => {
            const active = option === mode;
            return (
              <Pressable
                key={option}
                className="flex-1 items-center justify-center rounded-[21px]"
                style={active ? { backgroundColor: '#5F834B' } : undefined}
                onPress={() => setMode(option)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text
                  className={`text-[17px] ${active ? 'font-semibold text-[#FFFDF9]' : 'font-medium text-[#292D29]'}`}
                >
                  {ITEM_KIND_LABEL[option]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View className="mt-[14px] px-[38px]">
          <FieldLabel>物品名称</FieldLabel>
          <TextInput
            className={INPUT_CLASS}
            placeholder="请输入物品名称，如：校园卡"
            placeholderTextColor={PLACEHOLDER}
            value={title}
            onChangeText={setTitle}
            returnKeyType="done"
          />
          <View className="mt-[18px]">
            <FieldLabel>丢失/捡到时间</FieldLabel>
            <Pressable
              className={`${INPUT_CLASS} flex-row items-center`}
              onPress={() => {
                setDraftDate(dateTime ?? new Date());
                setPickerStage('date');
              }}
              accessibilityRole="button"
              accessibilityLabel="选择时间"
            >
              <Text className={`text-[14px] ${dateTime ? 'text-[#292D29]' : ''}`} style={dateTime ? undefined : { color: PLACEHOLDER }}>
                {dateTime
                  ? `${localDateString(dateTime.getTime())} ${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`
                  : '请选择时间'}
              </Text>
            </Pressable>
          </View>
          <View className="mt-[18px]">
            <FieldLabel>丢失/捡到地点</FieldLabel>
            <Pressable
              className={`${INPUT_CLASS} flex-row items-center`}
              onPress={() => setAreaSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="选择地点"
            >
              <Text className="text-[14px]" style={{ color: location ? '#292D29' : PLACEHOLDER }}>
                {location || '请选择地点，如：图书馆'}
              </Text>
            </Pressable>
          </View>
          <View className="mt-[18px]">
            <FieldLabel>物品描述</FieldLabel>
            <TextInput
              className="h-[70px] rounded-[10px] border border-[#E9E2D8] bg-[#F1EBE3] pl-[15px] pt-[10px] text-[13px] text-[#292D29]"
              placeholder="请详细描述物品的特征、颜色、品牌等信息…"
              placeholderTextColor={PLACEHOLDER}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View className="mt-[18px]">
            <FieldLabel>联系方式</FieldLabel>
            <TextInput
              className={INPUT_CLASS}
              placeholder="请输入手机号或微信号"
              placeholderTextColor={PLACEHOLDER}
              value={contact}
              onChangeText={setContact}
              returnKeyType="done"
            />
          </View>
          <View className="mt-[18px]">
            <FieldLabel>上传图片</FieldLabel>
            <View className="mt-[5px] flex-row items-center">
              {images.length < MAX_IMAGES
                ? (
                    <Pressable
                      className="h-[109px] w-[122px] items-center justify-center rounded-[13px]"
                      style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#BDB9AF' }}
                      onPress={() => void pickImages()}
                      accessibilityRole="button"
                      accessibilityLabel="添加图片"
                    >
                      <ImagePlusIcon size={34} color="#898C86" strokeWidth={1.6} />
                      <Text className="mt-[8px] text-[13px] text-[#898C86]">添加图片</Text>
                      <Text className="mt-[3px] text-[11px] text-[#898C86]">(最多9张)</Text>
                    </Pressable>
                  )
                : null}
              {images.length > 0
                ? (
                    <View className="flex-row items-center gap-[10px]">
                      {images.map((uri, index) => (
                        <View key={uri} className="relative">
                          <Image
                            source={{ uri }}
                            className="h-[109px] w-[109px] rounded-[13px] bg-[#F1EBE3]"
                            resizeMode="cover"
                          />
                          <Pressable
                            className="absolute -right-[6px] -top-[6px] size-[22px] items-center justify-center rounded-full bg-[#292D29]"
                            onPress={() => setImages(previous => previous.filter((_, i) => i !== index))}
                            accessibilityRole="button"
                            accessibilityLabel={`移除第${index + 1}张图片`}
                            hitSlop={6}
                          >
                            <Text className="text-[13px] font-semibold leading-[16px] text-[#FFFDF9]">×</Text>
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )
                : (
                    <Image
                      source={PUBLISH_STICKER}
                      className="ml-[24px] h-[100px] flex-1"
                      resizeMode="contain"
                    />
                  )}
            </View>
          </View>
        </View>
        {hint
          ? (
              <View className="mx-[18px] mb-[10px] mt-[20px] h-[42px] items-center justify-center rounded-[12px] bg-[#FFF4F1]">
                <Text className="text-[13px] font-medium text-[#A65D51]">{hint}</Text>
              </View>
            )
          : null}
        <Pressable
          className={`mx-[18px] mt-[20px] h-[54px] items-center justify-center rounded-[27px] bg-[#5F834B] ${submitting ? 'opacity-60' : ''}`}
          onPress={() => void submit()}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel="立即发布"
        >
          <Text className="text-[18px] font-semibold text-[#FFFDF9]">
            {submitting ? '提交中…' : '立即发布'}
          </Text>
        </Pressable>
      </ScrollView>
      <AreaSheet
        visible={areaSheetOpen}
        value={location}
        onSelect={(option) => {
          setLocation(option);
          setAreaSheetOpen(false);
        }}
        onClose={() => setAreaSheetOpen(false)}
      />
      {pickerStage
        ? (
            <DateTimePicker
              value={draftDate}
              mode={pickerStage}
              is24Hour
              maximumDate={pickerStage === 'date' ? new Date() : undefined}
              onChange={(event, selected) => {
                if (event.type === 'dismissed') {
                  setPickerStage(null);
                  return;
                }
                const next = selected ?? draftDate;
                if (pickerStage === 'date') {
                  setDraftDate(next);
                  setPickerStage('time');
                  return;
                }
                const combined = new Date(draftDate);
                combined.setHours(next.getHours(), next.getMinutes(), 0, 0);
                setDateTime(combined);
                setPickerStage(null);
              }}
            />
          )
        : null}
    </SafeAreaView>
  );
}
