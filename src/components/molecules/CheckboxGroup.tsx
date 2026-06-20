import { createContext, useContext, type ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Checkbox } from '../primitives/Checkbox';

type CheckboxGroupContextValue = {
  value: string[];
  toggle: (value: string) => void;
  disabled?: boolean;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

const useCheckboxGroup = () => {
  const ctx = useContext(CheckboxGroupContext);
  if (!ctx) throw new Error('CheckboxGroup.Item must be used inside <CheckboxGroup>');
  return ctx;
};

export type CheckboxGroupProps = {
  /** The currently checked values. */
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  gap?: number;
  children: ReactNode;
};

/**
 * Manages multi-selection across `CheckboxGroup.Item` children via context.
 *
 * @example
 * <CheckboxGroup value={included} onChange={setIncluded}>
 *   <CheckboxGroup.Item value="u1" label="Aanya" />
 *   <CheckboxGroup.Item value="u2" label="Rohan" />
 * </CheckboxGroup>
 */
function CheckboxGroupRoot({ value, onChange, disabled, gap = 3, children }: CheckboxGroupProps) {
  const theme = useTheme();
  const toggle = (item: string) =>
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item]);

  return (
    <CheckboxGroupContext.Provider value={{ value, toggle, disabled }}>
      <View style={{ gap: theme.spacing(gap) }}>{children}</View>
    </CheckboxGroupContext.Provider>
  );
}

function CheckboxGroupItem({ value, label, disabled }: { value: string; label?: string; disabled?: boolean }) {
  const ctx = useCheckboxGroup();
  return (
    <Checkbox
      checked={ctx.value.includes(value)}
      onChange={() => ctx.toggle(value)}
      label={label}
      disabled={disabled ?? ctx.disabled}
    />
  );
}

export const CheckboxGroup = Object.assign(CheckboxGroupRoot, { Item: CheckboxGroupItem });
