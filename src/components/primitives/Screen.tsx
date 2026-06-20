import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export type ScreenProps = {
  children: ReactNode;
  /** Wrap content in a ScrollView. */
  scrollable?: boolean;
  /** Apply the standard screen padding. */
  padded?: boolean;
  style?: ViewStyle;
};

/**
 * The page wrapper for every screen — applies the top safe-area inset, the app
 * background, and standard padding. Use `scrollable` for long content.
 *
 * @example
 * <Screen scrollable>…</Screen>
 */
export function Screen({ children, scrollable = false, padded = true, style }: ScreenProps) {
  const theme = useTheme();
  const inner: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: padded ? theme.spacing(5) : 0,
  };

  if (scrollable) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView
          contentContainerStyle={[inner, { paddingBottom: theme.spacing(12) }, style]}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[inner, style]}>{children}</View>
    </SafeAreaView>
  );
}
