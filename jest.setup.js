/* eslint-env jest */
// Gesture Handler ships a Jest setup that stubs its native module.
require('react-native-gesture-handler/jestSetup');

// Reanimated (pulled in transitively by @gorhom/bottom-sheet) provides a mock
// for the test environment.
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
