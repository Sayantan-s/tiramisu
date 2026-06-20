import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type InputProps = Omit<TextInputProps, 'style'> & {
  /** Field label rendered above the input. */
  label?: string;
  /** Error message; turns the border destructive and shows the text below. */
  error?: string;
  /** Static text rendered inside, before the input (e.g. a currency symbol). */
  prefix?: string;
};

/**
 * A single-line text field. Shows a focus ring, supports a label, prefix, and
 * error. For multi-field forms compose it via the `FormField` molecule.
 *
 * @example
 * <Input label="Amount" prefix="₹" keyboardType="numeric" />
 * <Input label="Email" error="Required" value={email} onChangeText={setEmail} />
 */
export function Input({ label, error, prefix, onFocus, onBlur, ...rest }: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? theme.colors.destructive : focused ? theme.colors.primary : theme.colors.input;

  return (
    <View style={{ gap: theme.spacing(1) }}>
      {label ? (
        <Text variant="label" tone="muted">
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing(3),
          paddingVertical: theme.spacing(3),
          borderWidth: 1,
          borderColor,
        }}>
        {prefix ? (
          <Text variant="body" tone="muted" style={{ marginRight: theme.spacing(2) }}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          placeholderTextColor={theme.colors.mutedForeground}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            color: theme.colors.foreground,
            fontFamily: theme.typography.body.fontFamily,
            fontSize: theme.typography.body.fontSize,
            padding: 0,
          }}
          {...rest}
        />
      </View>
      {error ? (
        <Text variant="caption" tone="destructive">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
