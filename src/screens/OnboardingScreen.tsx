import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, Button, Card, Input, Screen, Stack, Text } from '../components';
import { useHouseholdStore } from '../features/household/store';
import { useSmsStore } from '../features/sms/store';
import { useTheme } from '../theme';

const AVATAR_OPTIONS = ['🦊', '🐻', '🐱', '🐼', '🦉', '🐨'];

type Draft = { name: string; avatar?: string };

export function OnboardingScreen() {
  const theme = useTheme();
  const setup = useHouseholdStore((s) => s.setup);
  const initSms = useSmsStore((s) => s.initFromSeed);

  const [step, setStep] = useState<'household' | 'members' | 'me'>('household');
  const [householdName, setHouseholdName] = useState('Flat 4B');
  const [drafts, setDrafts] = useState<Draft[]>([
    { name: 'Alice', avatar: '🦊' },
    { name: 'Bob', avatar: '🐻' },
    { name: 'Carol', avatar: '🐱' },
  ]);
  const [meIndex, setMeIndex] = useState(0);

  const updateDraft = (i: number, patch: Partial<Draft>) =>
    setDrafts((d) => d.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  const addDraft = () =>
    setDrafts((d) => [...d, { name: '', avatar: AVATAR_OPTIONS[d.length % AVATAR_OPTIONS.length] }]);

  const removeDraft = (i: number) =>
    setDrafts((d) => (d.length > 2 ? d.filter((_, idx) => idx !== i) : d));

  const canContinueHousehold = householdName.trim().length > 0;
  const validDrafts = drafts.filter((d) => d.name.trim().length > 0);
  const canContinueMembers = validDrafts.length >= 2;

  const finish = () => {
    setup({ householdName: householdName.trim(), members: validDrafts, meIndex });
    initSms();
  };

  return (
    <Screen scrollable padded>
      <Stack gap={6}>
        <Stack gap={2}>
          <Text variant="caption" tone="accent" weight="700" style={{ letterSpacing: 2 }}>
            TIRAMISU
          </Text>
          <Text variant="title">
            {step === 'household'
              ? 'Name your household.'
              : step === 'members'
                ? 'Who lives here?'
                : 'Which one is you?'}
          </Text>
          <Text variant="body" tone="muted">
            {step === 'household'
              ? 'A friendly name — what you call the place over WhatsApp works.'
              : step === 'members'
                ? 'Two to five flatmates. You can add or remove anyone later.'
                : 'You can switch later from the profile menu in the corner.'}
          </Text>
        </Stack>

        {step === 'household' ? (
          <Card padding={5}>
            <Input
              label="Household name"
              value={householdName}
              onChangeText={setHouseholdName}
              placeholder="Flat 4B / Bandra Beach House…"
              autoFocus
            />
          </Card>
        ) : null}

        {step === 'members' ? (
          <Stack gap={3}>
            {drafts.map((d, i) => (
              <Card key={i} padding={4}>
                <Stack direction="row" gap={3} align="center">
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
                    {AVATAR_OPTIONS.map((a) => {
                      const active = d.avatar === a;
                      return (
                        <Pressable
                          key={a}
                          onPress={() => updateDraft(i, { avatar: a })}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: active ? theme.colors.accentMuted : 'transparent',
                          }}>
                          <Text style={{ fontSize: 18 }}>{a}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      value={d.name}
                      onChangeText={(t) => updateDraft(i, { name: t })}
                      placeholder="Name"
                    />
                  </View>
                  {drafts.length > 2 ? (
                    <Pressable onPress={() => removeDraft(i)}>
                      <Text tone="muted" variant="title">
                        ×
                      </Text>
                    </Pressable>
                  ) : null}
                </Stack>
              </Card>
            ))}
            {drafts.length < 5 ? (
              <Button title="+ Add roommate" variant="ghost" onPress={addDraft} />
            ) : null}
          </Stack>
        ) : null}

        {step === 'me' ? (
          <Stack gap={3}>
            {validDrafts.map((d, i) => {
              const active = i === meIndex;
              const member = { id: `tmp_${i}`, name: d.name, avatar: d.avatar };
              return (
                <Pressable key={i} onPress={() => setMeIndex(i)}>
                  <Card
                    padding={4}
                    style={{
                      borderWidth: 2,
                      borderColor: active ? theme.colors.accent : 'transparent',
                    }}>
                    <Stack direction="row" gap={3} align="center">
                      <Avatar member={member} size={40} ring={active} />
                      <Text variant="heading">{d.name}</Text>
                    </Stack>
                  </Card>
                </Pressable>
              );
            })}
          </Stack>
        ) : null}

        {step === 'household' ? (
          <Button
            title="Continue"
            fullWidth
            disabled={!canContinueHousehold}
            onPress={() => setStep('members')}
          />
        ) : step === 'members' ? (
          <Stack gap={3}>
            <Button
              title="Continue"
              fullWidth
              disabled={!canContinueMembers}
              onPress={() => setStep('me')}
            />
            <Button title="Back" variant="ghost" fullWidth onPress={() => setStep('household')} />
          </Stack>
        ) : (
          <Stack gap={3}>
            <Button title="That's me — finish setup" fullWidth onPress={finish} />
            <Button title="Back" variant="ghost" fullWidth onPress={() => setStep('members')} />
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
