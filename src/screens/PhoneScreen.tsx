import { useState } from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Input, Screen, Stack, Text } from '../components';
import { useAuthStore } from '../features/auth/store';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function PhoneScreen() {
  const nav = useNavigation<Nav>();
  const requestOtp = useAuthStore(s => s.requestOtp);
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (busy || phone.trim().length < 4) return;
    setBusy(true);
    setError(null);
    try {
      console.log('request otp');
      await requestOtp(phone.trim());
      nav.navigate('Otp');
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
            ← Back
          </Text>
        </Pressable>
        <Stack gap={2}>
          <Text variant="title">What's your number?</Text>
          <Text variant="body" tone="muted">
            We'll send a 6-digit code to confirm it's you. In dev the code is{' '}
            <Text variant="body" weight="700" tone="accent">
              123456
            </Text>
            .
          </Text>
        </Stack>
        <Card padding={5}>
          <Input
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="9999900001"
            keyboardType="phone-pad"
            autoFocus
            prefix="+91"
            error={error ?? undefined}
          />
        </Card>
        <Button
          title={busy ? 'Sending…' : 'Send code'}
          fullWidth
          disabled={busy}
          onPress={submit}
        />
      </Stack>
    </Screen>
  );
}
