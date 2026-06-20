import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type RadioProps = {
  selected: boolean;
  onPress: () => void;
  /** Optional inline label rendered to the right of the dot. */
  label?: string;
  disabled?: boolean;
};

/**
 * A single radio option. Group them with `RadioGroup` for managed selection.
 *
 * @example
 * <Radio selected={method === 'upi'} onPress={() => setMethod('upi')} label="UPI" />
 */
export function Radio({ selected, onPress, label, disabled }: RadioProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2), opacity: disabled ? 0.4 : 1 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: selected ? theme.colors.primary : theme.colors.input,
        }}>
        {selected ? (
          <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: theme.colors.primary }} />
        ) : null}
      </View>
      {label ? <Text variant="body">{label}</Text> : null}
    </Pressable>
  );
}
