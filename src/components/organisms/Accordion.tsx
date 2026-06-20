import { createContext, useContext, useState, type ReactNode } from 'react';
import { LayoutAnimation, Platform, Pressable, UIManager, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';
import { Icon } from '../primitives/Icon';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionContextValue = {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
};
const AccordionContext = createContext<AccordionContextValue | null>(null);
const useAccordion = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion.* must be used inside <Accordion>');
  return ctx;
};

// Each Item shares its own value with the Trigger/Content beneath it.
const ItemContext = createContext<string | null>(null);
const useItemValue = () => {
  const value = useContext(ItemContext);
  if (value == null) throw new Error('Accordion.Trigger/Content must be used inside <Accordion.Item>');
  return value;
};

export type AccordionProps = {
  /** Allow multiple panels open at once. */
  multiple?: boolean;
  /** Initially open item value(s). */
  defaultValue?: string | string[];
  children: ReactNode;
};

/**
 * A vertically stacked set of expandable panels with animated height.
 *
 * Compound API: `Accordion.Item`, `Accordion.Trigger`, `Accordion.Content`.
 *
 * @example
 * <Accordion defaultValue="rent">
 *   <Accordion.Item value="rent">
 *     <Accordion.Trigger>Rent</Accordion.Trigger>
 *     <Accordion.Content><Text>₹18,000 split 3 ways</Text></Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
function AccordionRoot({ multiple = false, defaultValue, children }: AccordionProps) {
  const theme = useTheme();
  const [open, setOpen] = useState<string[]>(
    defaultValue == null ? [] : Array.isArray(defaultValue) ? defaultValue : [defaultValue],
  );

  const toggle = (value: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => {
      const isOpen = prev.includes(value);
      if (multiple) return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
      return isOpen ? [] : [value];
    });
  };

  return (
    <AccordionContext.Provider value={{ isOpen: (v) => open.includes(v), toggle }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          overflow: 'hidden',
        }}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, children }: { value: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <ItemContext.Provider value={value}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>{children}</View>
    </ItemContext.Provider>
  );
}

function AccordionTrigger({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const value = useItemValue();
  const { isOpen, toggle } = useAccordion();
  const open = isOpen(value);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={() => toggle(value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(4),
      }}>
      <Text variant="body" weight="600">
        {children}
      </Text>
      <Icon name={open ? 'chevron-up' : 'chevron-down'} color="mutedForeground" />
    </Pressable>
  );
}

function AccordionContent({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const value = useItemValue();
  const { isOpen } = useAccordion();
  if (!isOpen(value)) return null;
  return <View style={{ paddingHorizontal: theme.spacing(4), paddingBottom: theme.spacing(4) }}>{children}</View>;
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
