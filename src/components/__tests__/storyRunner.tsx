/**
 * Minimal "portable stories" runner for React Native.
 *
 * `@storybook/react-native` doesn't ship `composeStories`, so this re-creates the
 * essential bit: it merges meta + story args and wraps the story in the same
 * provider stack as the Storybook `preview` (gesture handler, safe area, theme),
 * then renders it with `@testing-library/react-native`.
 *
 * Note: we intentionally do NOT mount `BottomSheetModalProvider` here — pulling in
 * `@gorhom/bottom-sheet` drags Reanimated's native worklets module into Jest,
 * which can't initialise in the node test environment. Stories that depend on the
 * bottom sheet (BottomSheet, Select) are exercised on-device instead.
 */
import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { render, type RenderResult } from '@testing-library/react-native';
import { ThemeProvider, type ThemeName } from '../../theme';

type AnyStory = {
  render?: (args: Record<string, unknown>, context: unknown) => ReactElement;
  args?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
};

type AnyMeta = {
  component?: (args: Record<string, unknown>) => ReactElement;
  args?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
};

export type StoryModule = { default: AnyMeta } & Record<string, AnyStory>;

/** The named story exports of a CSF module (everything except `default`). */
export function namedStories(mod: StoryModule): Array<[string, AnyStory]> {
  return Object.entries(mod).filter(
    ([name, value]) => name !== 'default' && value && typeof value === 'object',
  ) as Array<[string, AnyStory]>;
}

/** Render one story with its merged args inside the design system providers. */
export function renderStory(meta: AnyMeta, story: AnyStory): RenderResult {
  const args = { ...meta.args, ...story.args };
  const parameters = { ...meta.parameters, ...story.parameters };
  const scheme = (parameters.theme as ThemeName) ?? 'light';
  const context = { args, globals: {}, parameters, component: meta.component };

  const StoryComponent = () => {
    if (story.render) return story.render(args, context);
    const Component = meta.component;
    if (!Component) throw new Error('Story has neither a render function nor a meta.component');
    return <Component {...args} />;
  };

  return render(
    <GestureHandlerRootView>
      <SafeAreaProvider
        initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider forcedScheme={scheme}>
          <StoryComponent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>,
  );
}
