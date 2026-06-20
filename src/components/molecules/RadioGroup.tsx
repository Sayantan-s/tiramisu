import { createContext, useContext, type ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Radio } from '../primitives/Radio';

type RadioGroupContextValue<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue<string> | null>(null);

const useRadioGroup = () => {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error('RadioGroup.Item must be used inside <RadioGroup>');
  return ctx;
};

export type RadioGroupProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  /** Gap between items, in spacing units. */
  gap?: number;
  children: ReactNode;
};

/**
 * Manages single-selection across `RadioGroup.Item` children via context, so
 * the items don't each need wiring.
 *
 * @example
 * <RadioGroup value={method} onChange={setMethod}>
 *   <RadioGroup.Item value="upi" label="UPI" />
 *   <RadioGroup.Item value="cash" label="Cash" />
 * </RadioGroup>
 */
function RadioGroupRoot<T extends string>({ value, onChange, disabled, gap = 3, children }: RadioGroupProps<T>) {
  const theme = useTheme();
  return (
    <RadioGroupContext.Provider value={{ value, onChange: onChange as (v: string) => void, disabled }}>
      <View accessibilityRole="radiogroup" style={{ gap: theme.spacing(gap) }}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({ value, label, disabled }: { value: string; label?: string; disabled?: boolean }) {
  const ctx = useRadioGroup();
  return (
    <Radio
      selected={ctx.value === value}
      onPress={() => ctx.onChange(value)}
      label={label}
      disabled={disabled ?? ctx.disabled}
    />
  );
}

export const RadioGroup = Object.assign(RadioGroupRoot, { Item: RadioGroupItem });
