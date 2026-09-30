import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type TabBarIconProps = {
  name: 'home' | 'publish' | 'profile';
  color: string;
  focused: boolean;
};

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  const isPublish = name === 'publish';
  const size = isPublish ? 28 : 30;

  return (
    <View
      className="size-12 items-center justify-center rounded-full"
      style={isPublish ? { backgroundColor: '#5F834B' } : undefined}
      pointerEvents="none"
      accessible={false}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={isPublish ? '#FFFDF9' : color}
        strokeWidth={isPublish ? 2.2 : focused ? 2.1 : 1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {name === 'home'
          ? (
              <>
                <Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <Path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </>
            )
          : name === 'profile'
            ? (
                <>
                  <Circle cx="12" cy="8" r="5" />
                  <Path d="M20 21a8 8 0 0 0-16 0" />
                </>
              )
            : (
                <>
                  <Path d="M5 12h14" />
                  <Path d="M12 5v14" />
                </>
              )}
      </Svg>
    </View>
  );
}
