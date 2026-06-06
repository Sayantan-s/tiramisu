import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';

export type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: string;
  prefix?: string;
};

export function Input({ label, error, prefix, ...rest }: InputProps) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing(1) }}>
      {label ? (
        <Text variant="caption" tone="muted">
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.bgMuted,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing(3),
          paddingVertical: theme.spacing(3),
          borderWidth: error ? 1 : 0,
          borderColor: error ? theme.colors.danger : 'transparent',
        }}>
        {prefix ? (
          <Text variant="body" tone="muted" style={{ marginRight: theme.spacing(2) }}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          style={{
            flex: 1,
            color: theme.colors.text,
            fontSize: theme.typography.body.fontSize,
            padding: 0,
          }}
          {...rest}
        />
      </View>
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
