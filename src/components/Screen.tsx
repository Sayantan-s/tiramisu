import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { useTheme } from '../theme';

export function Screen({
  children,
  scrollable = false,
  padded = true,
  style,
}: {
  children: ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const inner: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: padded ? theme.spacing(5) : 0,
  };

  if (scrollable) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <ScrollView
          contentContainerStyle={[inner, { paddingBottom: theme.spacing(12) }, style]}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={[inner, style]}>{children}</View>
    </SafeAreaView>
  );
}
