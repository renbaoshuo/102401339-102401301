import type { ImageSourcePropType } from 'react-native';

import type { CampusItem, ItemImageKey } from './item';

const ITEM_IMAGES: Record<ItemImageKey, ImageSourcePropType> = {
  'backpack': require('@/assets/images/home/item-backpack.png'),
  'campus-card': require('@/assets/images/home/item-campus-card.png'),
  'airpods': require('@/assets/images/home/item-airpods.png'),
  'thermos': require('@/assets/images/home/item-thermos.png'),
  'keys': require('@/assets/images/home/keys.png'),
  'card-red': require('@/assets/images/home/card-red.png'),
  'card-green': require('@/assets/images/home/card-green.png'),
};

export function getItemImageSource(item: CampusItem): ImageSourcePropType | undefined {
  if (item.imageUri) {
    return { uri: item.imageUri };
  }
  return item.imageAssetKey ? ITEM_IMAGES[item.imageAssetKey] : undefined;
}

export function getItemThumbTint(item: CampusItem): string {
  switch (item.imageAssetKey) {
    case 'thermos': return '#DDD8C2';
    case 'keys': return '#D9C8A8';
    default: return '#DFD4BF';
  }
}
