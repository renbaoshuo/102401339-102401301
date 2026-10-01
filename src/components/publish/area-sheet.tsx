import { Modal, Pressable, Text, View } from 'react-native';

const LOCATION_OPTIONS = ['教学楼', '图书馆', '食堂', '宿舍', '操场', '体育馆', '实验楼'];

type AreaSheetProps = {
  visible: boolean;
  value: string;
  onSelect: (location: string) => void;
  onClose: () => void;
};

export function AreaSheet({ visible, value, onSelect, onClose }: AreaSheetProps) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(38, 49, 40, 0.22)' }}
          onPress={onClose}
          accessibilityLabel="关闭地点选择"
        />
        <View className="rounded-t-[16px] bg-[#FFFDF9] px-[21px] pb-[32px] pt-[20px]">
          <Text className="text-[17px] font-bold text-[#292D29]">选择地点</Text>
          <View className="mt-[15px] flex-row flex-wrap gap-x-[10px] gap-y-[12px]">
            {LOCATION_OPTIONS.map((option) => {
              const active = option === value;
              return (
                <Pressable
                  key={option}
                  className={`h-[40px] w-[106px] items-center justify-center rounded-[11px] ${active ? 'border border-[#5F834B] bg-[#E7EFE1]' : 'bg-[#F5F1EB]'}`}
                  onPress={() => onSelect(option)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text
                    className={`text-[13px] ${active ? 'font-semibold text-[#5F834B]' : 'text-[#292D29]'}`}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
