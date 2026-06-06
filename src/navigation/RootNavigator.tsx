import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../features/auth/store';
import { useGroupsStore } from '../features/groups/store';
import { useTheme } from '../theme';
import { AuthStack } from './AuthStack';
import { ModeStack } from './ModeStack';
import { GroupStack } from './GroupStack';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();
  const token = useAuthStore((s) => s.token);
  const activeGroupId = useGroupsStore((s) => s.activeGroupId);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}>
      {!token ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : !activeGroupId ? (
        <Stack.Screen name="Mode" component={ModeStack} />
      ) : (
        <Stack.Screen name="Group" component={GroupStack} />
      )}
    </Stack.Navigator>
  );
}
