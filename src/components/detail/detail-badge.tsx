import { Text, View } from 'react-native';

export function DetailBadge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View
      className="h-[28px] items-center justify-center rounded-[13px] px-[17px]"
      style={{ backgroundColor: bg }}
    >
      <Text className="text-[13px] font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
