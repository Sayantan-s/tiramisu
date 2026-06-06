import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Stack, Text } from '../components';
import { useTheme } from '../theme';
import { useAuthStore } from '../features/auth/store';
import { useGroupsStore } from '../features/groups/store';
import { useDevStore, type Dummy } from './store';

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const actingAsId = useDevStore((s) => s.actingAsId);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: 'absolute',
          right: 14,
          bottom: 100,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 999,
          backgroundColor: actingAsId ? theme.colors.danger : theme.colors.text,
          opacity: 0.85,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5,
          zIndex: 9999,
        }}
        accessibilityLabel="Dev tools">
        <Text variant="caption" weight="700" style={{ color: theme.colors.textInverse, letterSpacing: 1.5 }}>
          {actingAsId ? 'ACTING' : 'DEV'}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        presentationStyle="pageSheet">
        <DevPanelBody onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}

function DevPanelBody({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const { dummies, actingAsId, seedRoommate, forgetDummy, actAs, stopActing, reset } = useDevStore();
  const me = useAuthStore((s) => s.user);
  const activeGroupId = useGroupsStore((s) => s.activeGroupId);

  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await seedRoommate(name.trim());
      setName('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing(5), gap: theme.spacing(5), paddingBottom: theme.spacing(12) }}
        keyboardShouldPersistTaps="handled">
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="caption" tone="accent" weight="700" style={{ letterSpacing: 2 }}>
            DEV TOOLS
          </Text>
          <Pressable onPress={onClose}>
            <Text variant="heading" tone="muted">
              Done
            </Text>
          </Pressable>
        </Stack>

        <Card padding={4}>
          <Stack gap={2}>
            <Text variant="caption" tone="muted">
              ACTIVE USER
            </Text>
            <Text variant="heading">{me?.name ?? '—'}</Text>
            <Text variant="caption" tone="muted">
              {me?.phone ?? ''}
            </Text>
            {actingAsId ? (
              <Button title="Switch back to real user" variant="secondary" fullWidth onPress={stopActing} />
            ) : null}
          </Stack>
        </Card>

        <Stack gap={2}>
          <Text variant="heading">Dummy roommates</Text>
          <Text variant="caption" tone="muted">
            Each dummy is a real backend user with its own JWT, auto-joined to your active group.
            Tap "Act as" to assume their identity.
          </Text>

          {!activeGroupId ? (
            <Card padding={4} variant="muted">
              <Text tone="muted">Open a group first to add dummies.</Text>
            </Card>
          ) : null}

          {dummies.length === 0 ? (
            <Card padding={4} variant="muted">
              <Text tone="muted">No dummies yet.</Text>
            </Card>
          ) : (
            <Stack gap={2}>
              {dummies.map((d) => (
                <DummyRow
                  key={d.id}
                  dummy={d}
                  active={d.id === actingAsId}
                  onActAs={() => actAs(d.id)}
                  onForget={() => forgetDummy(d.id)}
                />
              ))}
            </Stack>
          )}

          <Card padding={4}>
            <Stack gap={3}>
              <Text variant="caption" tone="muted">
                ADD A DUMMY
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.colors.bgMuted,
                  borderRadius: theme.radii.md,
                  paddingHorizontal: theme.spacing(3),
                }}>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Name (e.g. Bob)"
                  placeholderTextColor={theme.colors.textMuted}
                  style={{
                    flex: 1,
                    color: theme.colors.text,
                    fontSize: 16,
                    paddingVertical: theme.spacing(3),
                  }}
                  autoCapitalize="words"
                />
              </View>
              {error ? <Text tone="danger" variant="caption">{error}</Text> : null}
              <Button
                title={busy ? 'Creating…' : '+ Add roommate'}
                fullWidth
                disabled={busy || !name.trim() || !activeGroupId}
                onPress={add}
              />
            </Stack>
          </Card>
        </Stack>

        <Stack gap={2}>
          <Text variant="heading">Danger</Text>
          <Button title="Forget all dummies" variant="danger" fullWidth onPress={reset} />
          <Text variant="caption" tone="muted">
            Removes local references only. Users remain on the server and inside groups.
          </Text>
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}

function DummyRow({
  dummy,
  active,
  onActAs,
  onForget,
}: {
  dummy: Dummy;
  active: boolean;
  onActAs: () => void;
  onForget: () => void;
}) {
  const theme = useTheme();
  return (
    <Card
      padding={4}
      style={{
        borderWidth: active ? 2 : 0,
        borderColor: active ? theme.colors.accent : 'transparent',
      }}>
      <Stack direction="row" gap={3} align="center">
        <Avatar member={dummy} size={40} ring={active} />
        <Stack gap={0} style={{ flex: 1 }}>
          <Text weight="700">{dummy.name}</Text>
          <Text variant="caption" tone="muted">
            {dummy.phone}
          </Text>
        </Stack>
        {active ? (
          <Text variant="caption" tone="accent" weight="700">
            ACTING
          </Text>
        ) : (
          <Button title="Act as" size="sm" variant="secondary" onPress={onActAs} />
        )}
        <Pressable onPress={onForget} hitSlop={10}>
          <Text variant="caption" tone="muted">
            ×
          </Text>
        </Pressable>
      </Stack>
    </Card>
  );
}
