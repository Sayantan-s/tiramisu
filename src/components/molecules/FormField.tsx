import { createContext, useContext, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';

type FormFieldContextValue = { error?: string; disabled?: boolean };

const FormFieldContext = createContext<FormFieldContextValue>({});

/** Read the enclosing field's error/disabled state (e.g. from a custom control). */
export const useFormField = () => useContext(FormFieldContext);

export type FormFieldProps = {
  /** When set, `FormField.Error` renders it and `FormField.Hint` is hidden. */
  error?: string;
  disabled?: boolean;
  children: ReactNode;
};

/**
 * Groups a label, control, hint, and error message and shares the field's
 * `error`/`disabled` state with its sub-components via context.
 *
 * Compound API: `FormField.Label`, `FormField.Control`, `FormField.Hint`, `FormField.Error`.
 *
 * @example
 * <FormField error={errors.amount}>
 *   <FormField.Label>Amount</FormField.Label>
 *   <FormField.Control><Input prefix="₹" keyboardType="numeric" /></FormField.Control>
 *   <FormField.Hint>Per person</FormField.Hint>
 *   <FormField.Error />
 * </FormField>
 */
function FormFieldRoot({ error, disabled, children }: FormFieldProps) {
  const theme = useTheme();
  return (
    <FormFieldContext.Provider value={{ error, disabled }}>
      <View style={{ gap: theme.spacing(1), opacity: disabled ? 0.6 : 1 }}>{children}</View>
    </FormFieldContext.Provider>
  );
}

function FormFieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text variant="label" tone="muted">
      {children}
    </Text>
  );
}

function FormFieldControl({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function FormFieldHint({ children }: { children: ReactNode }) {
  const { error } = useFormField();
  if (error) return null;
  return (
    <Text variant="caption" tone="muted">
      {children}
    </Text>
  );
}

/** Renders the field's context error, or explicit children if provided. */
function FormFieldError({ children }: { children?: ReactNode }) {
  const { error } = useFormField();
  const message = children ?? error;
  if (!message) return null;
  return (
    <Text variant="caption" tone="destructive">
      {message}
    </Text>
  );
}

export const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Control: FormFieldControl,
  Hint: FormFieldHint,
  Error: FormFieldError,
});
