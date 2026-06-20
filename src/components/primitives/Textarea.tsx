import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type TextareaProps = Omit<TextInputProps, 'style' | 'multiline'> & {
  label?: string;
  error?: string;
  /** Visible rows (approximate min height). Defaults to 4. */
  rows?: number;
  /** Show a `current / maxLength` counter. Requires `maxLength`. */
  showCount?: boolean;
};

/**
 * A multi-line text field. Same look as `Input`, sized to `rows`, with an
 * optional character counter.
 *
 * @example
 * <Textarea label="Note" rows={5} maxLength={140} showCount value={note} onChangeText={setNote} />
 */
export function Textarea({
  label,
  error,
  rows = 4,
  showCount = false,
  maxLength,
  value,
  onFocus,
  onBlur,
  ...rest
}: TextareaProps) {
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
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing(3),
          paddingVertical: theme.spacing(3),
          borderWidth: 1,
          borderColor,
        }}>
        <TextInput
          multiline
          textAlignVertical="top"
          maxLength={maxLength}
          value={value}
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
            minHeight: rows * theme.typography.body.lineHeight,
            color: theme.colors.foreground,
            fontFamily: theme.typography.body.fontFamily,
            fontSize: theme.typography.body.fontSize,
            padding: 0,
          }}
          {...rest}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {error ? (
          <Text variant="caption" tone="destructive">
            {error}
          </Text>
        ) : (
          <View />
        )}
        {showCount && maxLength ? (
          <Text variant="caption" tone="muted">
            {(value?.length ?? 0).toString()}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
