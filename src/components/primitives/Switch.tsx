import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { useTheme } from '../../theme';

export type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const TRACK_W = 48;
const TRACK_H = 28;
const THUMB = 22;
const PAD = (TRACK_H - THUMB) / 2;

/**
 * A controlled on/off toggle with an animated thumb.
 *
 * @example
 * <Switch value={reminders} onValueChange={setReminders} accessibilityLabel="Reminders" />
 */
export function Switch({ value, onValueChange, disabled, accessibilityLabel }: SwitchProps) {
  const theme = useTheme();
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.input, theme.colors.primary],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [PAD, TRACK_W - THUMB - PAD],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={{ opacity: disabled ? 0.4 : 1 }}>
      <Animated.View
        style={{ width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2, backgroundColor: trackColor, justifyContent: 'center' }}>
        <Animated.View
          style={{
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            backgroundColor: theme.colors.primaryForeground,
            transform: [{ translateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
