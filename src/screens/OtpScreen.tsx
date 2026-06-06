import { useState } from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Input, Screen, Stack, Text } from '../components';
import { useAuthStore } from '../features/auth/store';

export function OtpScreen() {
  const nav = useNavigation();
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (busy || otp.length < 4) return;
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(otp.trim(), name.trim() || undefined);
      // No nav needed — RootNavigator switches automatically on token presence.
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
          <Text variant="title">Enter the code</Text>
          <Text variant="body" tone="muted">
            Sent to +91 {pendingPhone}. Try {`123456`} in dev.
          </Text>
        </Stack>
        <Card padding={5}>
          <Stack gap={3}>
            <Input
              label="Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="number-pad"
              autoFocus
              maxLength={6}
            />
            <Input
              label="Your name (first time only)"
              value={name}
              onChangeText={setName}
              placeholder="Alice"
              autoCapitalize="words"
              error={error ?? undefined}
            />
          </Stack>
        </Card>
        <Button
          title={busy ? 'Verifying…' : 'Verify & sign in'}
          fullWidth
          disabled={busy}
          onPress={submit}
        />
      </Stack>
    </Screen>
  );
}
