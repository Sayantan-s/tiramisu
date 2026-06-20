import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';
import { Icon } from '../primitives/Icon';
import { BottomSheet } from './BottomSheet';

export type SelectOption<T extends string> = { value: T; label: string };

export type SelectProps<T extends string> = {
  value: T | null;
  onChange: (value: T) => void;
  options: ReadonlyArray<SelectOption<T>>;
  /** Shown when nothing is selected. */
  placeholder?: string;
  /** Title shown in the picker sheet. */
  title?: string;
  disabled?: boolean;
};

/**
 * A select control: a field-like trigger that opens a bottom-sheet option list.
 *
 * @example
 * <Select
 *   value={category}
 *   onChange={setCategory}
 *   placeholder="Pick a category"
 *   options={[{ value: 'rent', label: 'Rent' }, { value: 'food', label: 'Food' }]}
 * />
 */
export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  title = 'Select',
  disabled,
}: SelectProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.muted,
          borderWidth: 1,
          borderColor: theme.colors.input,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing(3),
          paddingVertical: theme.spacing(3),
          opacity: disabled ? 0.4 : 1,
        }}>
        <Text variant="body" tone={selected ? 'default' : 'muted'}>
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="chevron-down" color="mutedForeground" />
      </Pressable>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <BottomSheet.Header onClose={() => setOpen(false)}>{title}</BottomSheet.Header>
        <BottomSheet.Content>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: theme.spacing(3),
                  paddingHorizontal: theme.spacing(3),
                  borderRadius: theme.radii.md,
                  backgroundColor: isSelected ? theme.colors.muted : 'transparent',
                }}>
                <Text variant="body" weight={isSelected ? '600' : '400'}>
                  {opt.label}
                </Text>
                {isSelected ? <Icon name="check" color="primary" /> : <View />}
              </Pressable>
            );
          })}
        </BottomSheet.Content>
      </BottomSheet>
    </>
  );
}
