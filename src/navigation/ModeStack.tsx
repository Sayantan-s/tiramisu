import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { ModeHubScreen } from '../screens/ModeHubScreen';
import { GroupsListScreen } from '../screens/GroupsListScreen';
import { CreateGroupScreen } from '../screens/CreateGroupScreen';
import { JoinGroupScreen } from '../screens/JoinGroupScreen';
import type { ModeStackParamList } from './types';

const Stack = createNativeStackNavigator<ModeStackParamList>();

export function ModeStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}>
      <Stack.Screen name="ModeHub" component={ModeHubScreen} />
      <Stack.Screen name="GroupsList" component={GroupsListScreen} />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="JoinGroup"
        component={JoinGroupScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
