import type { ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type LucideIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

function BaseIcon({
  size = 24,
  color = '#898C86',
  strokeWidth = 2,
  children,
}: LucideIconProps & { children: ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export function SearchIcon(props: LucideIconProps) {
  return (
    <BaseIcon {...props}>
      <Path d="m21 21-4.34-4.34" />
      <Circle cx="11" cy="11" r="8" />
    </BaseIcon>
  );
}

export function MapPinIcon(props: LucideIconProps) {
  return (
    <BaseIcon {...props}>
      <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <Circle cx="12" cy="10" r="3" />
    </BaseIcon>
  );
}

export function CalendarDaysIcon(props: LucideIconProps) {
  return (
    <BaseIcon {...props}>
      <Path d="M8 2v3" />
      <Path d="M16 2v3" />
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M3 9h18" />
      <Path d="M8 13h.01" />
      <Path d="M12 13h.01" />
      <Path d="M16 13h.01" />
      <Path d="M8 17h.01" />
      <Path d="M12 17h.01" />
      <Path d="M16 17h.01" />
    </BaseIcon>
  );
}

export function ChevronLeftIcon(props: LucideIconProps) {
  return (
    <BaseIcon {...props}>
      <Path d="m15 18-6-6 6-6" />
    </BaseIcon>
  );
}

export function ChevronDownIcon(props: LucideIconProps) {
  return (
    <BaseIcon {...props}>
      <Path d="m6 9 6 6 6-6" />
    </BaseIcon>
  );
}

export function ClockIcon(props: LucideIconProps) {
  return (
    <BaseIcon {...props}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6v6h4" />
    </BaseIcon>
  );
}

export function SettingsIcon(props: LucideIconProps) {
  return (
    <BaseIcon {...props}>
      <Path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <Circle cx="12" cy="12" r="3" />
    </BaseIcon>
  );
}
