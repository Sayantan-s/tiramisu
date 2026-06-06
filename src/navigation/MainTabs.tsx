import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../components/Text';
import { MonthRoomScreen } from '../screens/MonthRoomScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SettleScreen } from '../screens/SettleScreen';

export type MainTabParamList = {
  Feed: undefined;
  Scan: undefined;
  Settle: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, string> = {
  Feed: '◐',
  Scan: '◉',
  Settle: '↔',
};

export function MainTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.bgElevated,
          borderTopColor: theme.colors.border,
          paddingTop: 6,
          height: Platform.OS === 'ios' ? 86 : 64,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIcon: ({ focused, color }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, color }} weight={focused ? '800' : '500'}>
              {ICONS[route.name as keyof MainTabParamList]}
            </Text>
          </View>
        ),
      })}>
      <Tab.Screen name="Feed" component={MonthRoomScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Settle" component={SettleScreen} />
    </Tab.Navigator>
  );
}
