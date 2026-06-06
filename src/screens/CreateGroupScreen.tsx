import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Input, Screen, Stack, Text } from '../components';
import { useGroupsStore } from '../features/groups/store';
import { useTheme } from '../theme';

const ICONS = ['🏠', '🛋', '🏖', '🌇', '🌵', '🏔', '🏝'];

export function CreateGroupScreen() {
  const nav = useNavigation();
  const theme = useTheme();
  const createGroup = useGroupsStore((s) => s.createGroup);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(ICONS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createGroup({ kind: 'roomies', name: name.trim(), icon });
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
          <Text variant="title">New household</Text>
          <Text variant="body" tone="muted">
            Pick a name and an icon. You'll be the first member and can invite the rest in a moment.
          </Text>
        </Stack>
        <Card padding={5}>
          <Stack gap={4}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Flat 4B"
              autoFocus
              autoCapitalize="words"
              error={error ?? undefined}
            />
            <Stack gap={2}>
              <Text variant="caption" tone="muted">
                ICON
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2) }}>
                {ICONS.map((i) => {
                  const active = i === icon;
                  return (
                    <Pressable
                      key={i}
                      onPress={() => setIcon(i)}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: theme.radii.md,
                        backgroundColor: active ? theme.colors.accentMuted : theme.colors.bgMuted,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: active ? 2 : 0,
                        borderColor: theme.colors.accent,
                      }}>
                      <Text style={{ fontSize: 26 }}>{i}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Stack>
          </Stack>
        </Card>
        <Button title={busy ? 'Creating…' : 'Create'} fullWidth disabled={busy} onPress={submit} />
      </Stack>
    </Screen>
  );
}
