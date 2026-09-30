import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View className="size-20 items-center justify-center rounded-3xl bg-sky-500/10">
          <Text className="text-4xl">🎒</Text>
        </View>
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          校园失物招领系统
        </Text>
        <View className="rounded-full bg-sky-500/10 px-4 py-2">
          <Text className="text-sm font-medium text-sky-600 dark:text-sky-300">
            NativeWind 已就绪 · 用 className 写样式
          </Text>
        </View>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          编辑 src/app/(tabs)/index.tsx 开始开发
        </Text>
      </View>
    </SafeAreaView>
  );
}
