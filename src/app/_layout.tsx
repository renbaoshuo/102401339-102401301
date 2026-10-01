import '../../global.css';

import { Stack } from 'expo-router';

import { ItemsProvider } from '@/features/items/items-context';

export default function RootLayout() {
  return (
    <ItemsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="detail/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
      </Stack>
    </ItemsProvider>
  );
}
