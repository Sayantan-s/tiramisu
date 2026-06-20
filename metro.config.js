const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// `withStorybook` enables `transformer.unstable_allowRequireContext` and, when
// enabled, swaps the entry to the generated on-device Storybook. Toggle with
// STORYBOOK_ENABLED=true (see the `storybook` package.json scripts).
module.exports = withStorybook(mergedConfig, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});
