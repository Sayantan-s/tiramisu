/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

// When STORYBOOK_ENABLED=true, the app boots into the on-device Storybook UI
// instead of the real app. See the `storybook` scripts in package.json.
if (process.env.STORYBOOK_ENABLED === 'true') {
  const StorybookUIRoot = require('./.rnstorybook').default;
  AppRegistry.registerComponent(appName, () => StorybookUIRoot);
} else {
  const App = require('./App').default;
  AppRegistry.registerComponent(appName, () => App);
}
