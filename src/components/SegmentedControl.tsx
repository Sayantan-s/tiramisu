import { Pressable, View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';

export type SegmentedControlProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.bgMuted,
        borderRadius: theme.radii.pill,
        padding: 4,
      }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              backgroundColor: active ? theme.colors.bgElevated : 'transparent',
              borderRadius: theme.radii.pill,
              paddingVertical: theme.spacing(2),
              alignItems: 'center',
            }}>
            <Text variant="caption" weight={active ? '700' : '500'} tone={active ? 'default' : 'muted'}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
