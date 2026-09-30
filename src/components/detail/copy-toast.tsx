import { Animated, Text } from 'react-native';

import { CheckIcon } from '@/components/icons/lucide-icons';

type CopyToastProps = {
  opacity: Animated.Value;
  bottom: number;
};

export function CopyToast({ opacity, bottom }: CopyToastProps) {
  return (
    <Animated.View
      className="absolute w-[280px] flex-row items-center self-center rounded-[20px] bg-[#29352A]"
      style={{ opacity, bottom, height: 53, left: '50%', marginLeft: -140 }}
      pointerEvents="none"
    >
      <Animated.View className="ml-[15px] size-[24px] items-center justify-center rounded-full bg-[#5F834B]">
        <CheckIcon size={13} color="#FFFDF9" strokeWidth={3} />
      </Animated.View>
      <Text className="ml-[13px] text-[13px] font-medium text-[#FFFDF9]">联系方式已复制</Text>
    </Animated.View>
  );
}
