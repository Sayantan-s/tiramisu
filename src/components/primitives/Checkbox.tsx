import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { Icon } from './Icon';

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Optional inline label rendered to the right of the box. */
  label?: string;
  disabled?: boolean;
};

/**
 * A controlled checkbox with an optional inline label.
 *
 * @example
 * <Checkbox checked={agree} onChange={setAgree} label="Split equally" />
 */
export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2), opacity: disabled ? 0.4 : 1 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: theme.radii.xs,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? theme.colors.primary : 'transparent',
          borderWidth: checked ? 0 : 1.5,
          borderColor: theme.colors.input,
        }}>
        {checked ? <Icon name="check" size={15} color="primaryForeground" strokeWidth={3} /> : null}
      </View>
      {label ? <Text variant="body">{label}</Text> : null}
    </Pressable>
  );
}
