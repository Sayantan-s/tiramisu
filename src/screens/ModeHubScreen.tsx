import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Screen, Stack, Text } from '../components';
import { useAuthStore } from '../features/auth/store';
import { useTheme } from '../theme';
import type { ModeStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<ModeStackParamList>;

export function ModeHubScreen() {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <Screen scrollable padded>
      <Stack gap={6}>
        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            HI {user?.name?.split(' ')[0]?.toUpperCase() ?? 'THERE'}
          </Text>
          <Text variant="title">What are we settling?</Text>
        </Stack>

        <Pressable onPress={() => nav.navigate('GroupsList')}>
          <Card padding={5}>
            <Stack gap={2}>
              <Text style={{ fontSize: 40 }}>🏠</Text>
              <Text variant="heading">Roomies</Text>
              <Text variant="body" tone="muted">
                Monthly expenses with the same group. Rent, utilities, groceries.
              </Text>
            </Stack>
          </Card>
        </Pressable>

        <Card
          padding={5}
          style={{
            opacity: 0.55,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: 'transparent',
          }}>
          <Stack gap={2}>
            <Stack direction="row" justify="space-between" align="center">
              <Text style={{ fontSize: 40 }}>🧳</Text>
              <Text
                variant="caption"
                tone="muted"
                weight="700"
                style={{
                  letterSpacing: 1.5,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 999,
                  backgroundColor: theme.colors.bgMuted,
                }}>
                COMING SOON
              </Text>
            </Stack>
            <Text variant="heading">Trips</Text>
            <Text variant="body" tone="muted">
              Ad-hoc shared spends for travel groups. We'll let you know when this lands.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Screen>
  );
}
