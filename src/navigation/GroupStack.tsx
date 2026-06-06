import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { GroupLandingScreen } from '../screens/GroupLandingScreen';
import { InvitePeopleScreen } from '../screens/InvitePeopleScreen';
import type { GroupStackParamList } from './types';

const Stack = createNativeStackNavigator<GroupStackParamList>();

export function GroupStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}>
      <Stack.Screen name="Landing" component={GroupLandingScreen} />
      <Stack.Screen
        name="InvitePeople"
        component={InvitePeopleScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
