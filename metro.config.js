const path = require('path');
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
const finalConfig = withStorybook(mergedConfig, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
});

// Storybook's on-device controls addon pulls in react-native-modal-datetime-picker,
// which requires the native @react-native-community/datetimepicker. We don't use
// date controls, so resolve that optional import to a no-op stub instead of adding
// a native module. See metro-stubs/datetimepicker.js.
const previousResolveRequest = finalConfig.resolver && finalConfig.resolver.resolveRequest;
finalConfig.resolver = {
  ...finalConfig.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName === '@react-native-community/datetimepicker') {
      return {
        type: 'sourceFile',
        filePath: path.resolve(__dirname, 'metro-stubs/datetimepicker.js'),
      };
    }
    const next = previousResolveRequest || context.resolveRequest;
    return next(context, moduleName, platform);
  },
};

module.exports = finalConfig;
