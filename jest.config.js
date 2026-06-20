module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  // storyRunner is a shared test helper, not a test suite.
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/storyRunner\\.tsx$'],
  // The default RN preset only allows-lists react-native itself. Our component
  // tests render stories that pull in these ESM/Flow-shipping native packages,
  // so they must also be transformed.
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(' +
      '@react-native|react-native|@react-navigation|' +
      'react-native-reanimated|react-native-worklets|react-native-gesture-handler|' +
      'react-native-svg|@gorhom|lucide-react-native|react-native-is-edge-to-edge|' +
      '@storybook|storybook' +
      ')/)',
  ],
};
