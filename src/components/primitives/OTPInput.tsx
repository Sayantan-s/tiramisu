import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Number of digit boxes. Defaults to 6. */
  length?: number;
  /** Fired once `value` reaches `length`. */
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
};

/**
 * A one-time-code field rendered as a row of boxes backed by a single hidden
 * input. Numeric only; clamps to `length`.
 *
 * @example
 * <OTPInput value={code} onChange={setCode} onComplete={verify} />
 */
export function OTPInput({ value, onChange, length = 6, onComplete, autoFocus }: OTPInputProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const digits = value.slice(0, length).split('');
  const focusedIndex = digits.length;

  const handleChange = (next: string) => {
    const cleaned = next.replace(/\D/g, '').slice(0, length);
    onChange(cleaned);
    if (cleaned.length === length) onComplete?.(cleaned);
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={{ flexDirection: 'row', gap: theme.spacing(2) }}>
      {Array.from({ length }).map((_, i) => {
        const active = i === focusedIndex;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              aspectRatio: 0.8,
              maxWidth: 56,
              borderRadius: theme.radii.md,
              borderWidth: active ? 2 : 1,
              borderColor: active ? theme.colors.primary : theme.colors.input,
              backgroundColor: theme.colors.muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text variant="title">{digits[i] ?? ''}</Text>
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        // Visually hidden, but still focusable and capturing keystrokes.
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
      />
    </Pressable>
  );
}
