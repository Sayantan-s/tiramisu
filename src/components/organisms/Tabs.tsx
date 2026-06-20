import { createContext, useContext, useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';

type TabsContextValue = {
  active: string;
  setActive: (value: string) => void;
};
const TabsContext = createContext<TabsContextValue | null>(null);
const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>');
  return ctx;
};

export type TabsProps = {
  /** Initially active tab value (uncontrolled). */
  defaultValue: string;
  /** Controlled active value. */
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
};

/**
 * A tabbed view with an underlined trigger row and swappable panels.
 *
 * Compound API: `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`.
 *
 * @example
 * <Tabs defaultValue="owed">
 *   <Tabs.List>
 *     <Tabs.Trigger value="owed">You owe</Tabs.Trigger>
 *     <Tabs.Trigger value="owes">Owed to you</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="owed"><Text>…</Text></Tabs.Content>
 *   <Tabs.Content value="owes"><Text>…</Text></Tabs.Content>
 * </Tabs>
 */
function TabsRoot({ defaultValue, value, onValueChange, children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value ?? internal;
  const setActive = (next: string) => {
    if (value == null) setInternal(next);
    onValueChange?.(next);
  };
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

function TabsList({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', gap: theme.spacing(4), borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      {children}
    </View>
  );
}

function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const theme = useTheme();
  const { active, setActive } = useTabs();
  const isActive = active === value;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      onPress={() => setActive(value)}
      style={{
        paddingVertical: theme.spacing(3),
        borderBottomWidth: 2,
        borderBottomColor: isActive ? theme.colors.primary : 'transparent',
      }}>
      <Text variant="label" weight={isActive ? '700' : '500'} tone={isActive ? 'primary' : 'muted'}>
        {children}
      </Text>
    </Pressable>
  );
}

function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const theme = useTheme();
  const { active } = useTabs();
  if (active !== value) return null;
  return <View style={{ paddingTop: theme.spacing(4) }}>{children}</View>;
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
