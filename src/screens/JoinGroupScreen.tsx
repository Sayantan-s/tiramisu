import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Button, Card, Input, Screen, Stack, Text } from '../components';
import { useGroupsStore } from '../features/groups/store';
import type { ModeStackParamList } from '../navigation/types';

type R = RouteProp<ModeStackParamList, 'JoinGroup'>;

export function JoinGroupScreen() {
  const nav = useNavigation();
  const route = useRoute<R>();
  const acceptInvite = useGroupsStore((s) => s.acceptInvite);
  const [code, setCode] = useState(route.params?.prefill ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.prefill) setCode(route.params.prefill);
  }, [route.params?.prefill]);

  const submit = async () => {
    if (busy || !code.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await acceptInvite(code.trim().toUpperCase());
      nav.goBack();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen padded>
      <Stack gap={5}>
        <Pressable onPress={() => nav.goBack()}>
          <Text variant="caption" tone="muted">
            ← Cancel
          </Text>
        </Pressable>
        <Stack gap={2}>
          <Text variant="title">Join a household</Text>
          <Text variant="body" tone="muted">
            Paste the 8-character invite code your roommate shared with you.
          </Text>
        </Stack>
        <Card padding={5}>
          <Input
            label="Invite code"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            placeholder="ABC23XYZ"
            autoFocus
            maxLength={8}
            autoCapitalize="characters"
            autoCorrect={false}
            error={error ?? undefined}
          />
        </Card>
        <Button title={busy ? 'Joining…' : 'Join'} fullWidth disabled={busy} onPress={submit} />
      </Stack>
    </Screen>
  );
}
