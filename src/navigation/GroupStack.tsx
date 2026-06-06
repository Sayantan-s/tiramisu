import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { MainTabs } from './MainTabs';
import { InvitePeopleScreen } from '../screens/InvitePeopleScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { ExpenseDetailScreen } from '../screens/ExpenseDetailScreen';
import { ConfirmCaptureScreen } from '../screens/ConfirmCaptureScreen';
import { GroupLandingScreen } from '../screens/GroupLandingScreen';
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
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen
        name="InvitePeople"
        component={InvitePeopleScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ConfirmCapture"
        component={ConfirmCaptureScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Members"
        component={GroupLandingScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
