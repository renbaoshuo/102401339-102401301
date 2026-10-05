import { Image, Text, View } from 'react-native';

const HERO_IMAGE = require('@/assets/images/home/hero-campus.jpg');

// 设计稿横幅比例 804x550,文字块中心位于横幅高度的 68.35% 处
const HERO_RATIO = 804 / 550;
const TEXT_BLOCK_HEIGHT = 55;

export function HeroBanner() {
  return (
    <View style={{ width: '100%', aspectRatio: HERO_RATIO }}>
      <Image source={HERO_IMAGE} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          width: '57%',
          alignItems: 'center',
          top: '68.35%',
          marginTop: -TEXT_BLOCK_HEIGHT / 2,
          transform: [{ rotate: '-4deg' }],
        }}
      >
        <Text
          style={{
            fontSize: 24,
            lineHeight: 30,
            fontWeight: '700',
            color: '#243432',
            letterSpacing: 2,
          }}
        >
          校园失物招领
        </Text>
        <Text
          style={{
            marginTop: 7,
            fontSize: 13,
            lineHeight: 18,
            fontWeight: '600',
            color: '#48665C',
            letterSpacing: 1,
          }}
        >
          让善意在校园里循环
        </Text>
      </View>
    </View>
  );
}
