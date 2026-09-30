import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublishScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F7F3ED]">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <Text className="text-2xl font-semibold text-[#2D332E]">发布信息</Text>
        <Text className="text-sm text-[#858A85]">发布表单待实现</Text>
      </View>
    </SafeAreaView>
  );
}
