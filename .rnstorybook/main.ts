import type { StorybookConfig } from '@storybook/react-native';

/**
 * On-device Storybook configuration.
 *
 * Stories live next to the components they document under `src/components`.
 * Run `yarn storybook-generate` after adding/removing a story file (or rely on
 * the Metro `withStorybook` wrapper to regenerate on the fly).
 */
const main: StorybookConfig = {
  stories: ['../src/components/**/*.stories.?(ts|tsx)'],
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-backgrounds',
  ],
  framework: '@storybook/react-native',
};

export default main;
