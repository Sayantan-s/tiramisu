import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { PhoneScreen } from '../screens/PhoneScreen';
import { OtpScreen } from '../screens/OtpScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
    </Stack.Navigator>
  );
}
