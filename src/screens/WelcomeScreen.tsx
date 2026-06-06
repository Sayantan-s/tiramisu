import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Screen, Stack, Text } from '../components';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function WelcomeScreen() {
  const nav = useNavigation<Nav>();
  return (
    <Screen padded>
      <Stack gap={6} style={{ flex: 1, justifyContent: 'center' }}>
        <Stack gap={2}>
          <Text variant="caption" tone="accent" weight="700" style={{ letterSpacing: 2 }}>
            TIRAMISU
          </Text>
          <Text variant="display">Roomies. Trips. Settled.</Text>
          <Text variant="body" tone="muted">
            Shared expenses without the spreadsheet. Sign in with your phone to get started.
          </Text>
        </Stack>
        <Button title="Get started →" fullWidth onPress={() => nav.navigate('Phone')} />
      </Stack>
    </Screen>
  );
}
