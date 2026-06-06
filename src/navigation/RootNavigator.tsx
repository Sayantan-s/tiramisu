import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useHouseholdStore } from '../features/household/store';
import { useTheme } from '../theme';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { MainTabs } from './MainTabs';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { ExpenseDetailScreen } from '../screens/ExpenseDetailScreen';
import { ConfirmCaptureScreen } from '../screens/ConfirmCaptureScreen';
import { ProfileSwitcherScreen } from '../screens/ProfileSwitcherScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const initialized = useHouseholdStore((s) => s.initialized);
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}>
      {!initialized ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
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
            name="ProfileSwitcher"
            component={ProfileSwitcherScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
