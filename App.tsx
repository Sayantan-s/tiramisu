/**
 * Tiramisu — month-end roommate expense splitter.
 *
 * @format
 */

import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import { ThemeProvider } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/features/auth/store';
import { useInvitesStore } from './src/features/invites/store';
import { useGroupsStore } from './src/features/groups/store';
import { installDeepLinkHandler } from './src/lib/deeplinks';
import type { RootStackParamList } from './src/navigation/types';

if (__DEV__) {
  require('./ReactotronConfig');
}

const navigationRef = createNavigationContainerRef<RootStackParamList>();

function App() {
  const scheme = useColorScheme();

  useEffect(() => installDeepLinkHandler(), []);

  // When an invite code is pending and the user is authed, route them to JoinGroup.
  useEffect(() => {
    const tryRoute = () => {
      const code = useInvitesStore.getState().pendingCode;
      const token = useAuthStore.getState().token;
      if (!code || !token || !navigationRef.isReady()) return;
      useGroupsStore.getState().setActiveGroup(null);
      navigationRef.navigate('Mode', { screen: 'JoinGroup', params: { prefill: code } });
      useInvitesStore.getState().consume();
    };
    const unsubInvite = useInvitesStore.subscribe(tryRoute);
    const unsubAuth = useAuthStore.subscribe(tryRoute);
    tryRoute();
    return () => {
      unsubInvite();
      unsubAuth();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
