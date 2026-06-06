import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Button, Card, Screen, Stack, Text } from '../components';
import { useHouseholdStore } from '../features/household/store';
import { useExpensesStore } from '../features/expenses/store';
import { useSettlementsStore } from '../features/settlements/store';
import { useSmsStore } from '../features/sms/store';
import { useTheme } from '../theme';

export function ProfileSwitcherScreen() {
  const nav = useNavigation();
  const theme = useTheme();
  const { members, currentUserId, setCurrentUser, reset: resetHousehold } = useHouseholdStore();
  const resetExpenses = useExpensesStore((s) => s.reset);
  const resetSettlements = useSettlementsStore((s) => s.reset);
  const resetSms = useSmsStore((s) => s.reset);

  const resetEverything = () => {
    resetExpenses();
    resetSettlements();
    resetSms();
    resetHousehold();
  };

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Stack gap={2}>
          <Text variant="caption" tone="accent" weight="700" style={{ letterSpacing: 2 }}>
            VIEWING AS
          </Text>
          <Text variant="title">Switch profile</Text>
          <Text variant="body" tone="muted">
            Acting as different flatmates lets you preview how the app behaves for each of them.
          </Text>
        </Stack>

        <Stack gap={3}>
          {members.map((m) => {
            const active = m.id === currentUserId;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  setCurrentUser(m.id);
                  nav.goBack();
                }}>
                <Card
                  padding={4}
                  style={{
                    borderWidth: 2,
                    borderColor: active ? theme.colors.accent : 'transparent',
                  }}>
                  <Stack direction="row" gap={3} align="center">
                    <Avatar member={m} size={44} ring={active} />
                    <Stack gap={1} style={{ flex: 1 }}>
                      <Text variant="heading">{m.name}</Text>
                      {active ? (
                        <Text variant="caption" tone="accent">
                          currently active
                        </Text>
                      ) : null}
                    </Stack>
                  </Stack>
                </Card>
              </Pressable>
            );
          })}
        </Stack>

        <Stack gap={2}>
          <Text variant="heading">Danger zone</Text>
          <Button title="Reset all data" variant="danger" onPress={resetEverything} fullWidth />
          <Text variant="caption" tone="muted">
            Wipes household, expenses, settlements, and SMS hints.
          </Text>
        </Stack>
      </Stack>
    </Screen>
  );
}
