import type { Preview } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider, useTheme, type ThemeName } from '../src/theme';

/** A padded canvas that paints itself with the active theme's background. */
function Canvas({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing(4),
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
      }}>
      {children}
    </View>
  );
}

const preview: Preview = {
  /**
   * Every story is wrapped in the same provider stack as the real app, plus a
   * theme. The theme is read from the `theme` toolbar global (where the device
   * UI supports it) and falls back to a per-story `parameters.theme` — this is
   * what the `Dark` stories and the Jest render tests use to force dark mode.
   */
  decorators: [
    (Story, context) => {
      const scheme = (context.globals.theme ??
        context.parameters.theme ??
        'light') as ThemeName;
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <ThemeProvider forcedScheme={scheme}>
              <BottomSheetModalProvider>
                <Canvas>
                  <Story />
                </Canvas>
              </BottomSheetModalProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      );
    },
  ],
  parameters: {
    controls: { expanded: true },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
};

export default preview;
