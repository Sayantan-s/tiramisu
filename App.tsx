/**
 * Tiramisu — month-end roommate expense splitter.
 *
 * @format
 */

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import { ThemeProvider } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
