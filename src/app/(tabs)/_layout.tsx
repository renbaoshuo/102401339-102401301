import { Tabs } from 'expo-router';
import { Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarIcon } from '@/components/navigation/tab-bar-icon';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const extraLabelHeight = Math.max(0, Math.ceil(18 * (fontScale - 1)));

  return (
    <Tabs
      initialRouteName="index"
      backBehavior="initialRoute"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#5F834B',
        tabBarInactiveTintColor: '#858A85',
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 81 + insets.bottom + extraLabelHeight,
          paddingTop: 3,
          paddingBottom: 1 + insets.bottom,
          backgroundColor: '#FFFDF9',
          borderTopColor: '#E9E2D8',
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarIconStyle: { width: 48, height: 48 },
        tabBarLabel: ({ focused, color, children }) => (
          <Text
            className={focused ? 'text-[13px] font-semibold leading-[18px]' : 'text-[13px] font-normal leading-[18px]'}
            style={{ color: route.name === 'publish' ? '#5F834B' : color }}
          >
            {children}
          </Text>
        ),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: '发布',
          tabBarButtonTestID: 'tab-publish',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="publish" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarButtonTestID: 'tab-profile',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="profile" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
