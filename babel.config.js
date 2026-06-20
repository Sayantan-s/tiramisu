module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Required by react-native-reanimated v4 (used by Storybook's on-device UI
  // and @gorhom/bottom-sheet). Must remain the LAST plugin.
  plugins: ['react-native-worklets/plugin'],
};
