import { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon, OTPInput, Screen, Stack, Text } from '../components';
import { useTheme } from '../theme';
import { useAuthStore } from '../features/auth/store';
import { AccentPromo, AuthTopBar } from './auth/AuthParts';

const RESEND_SECONDS = 30;

/** "9876543210" → "98XXX XXX10" */
const maskPhone = (p: string | null): string => {
  if (!p || p.length < 4) return p ?? '';
  return `${p.slice(0, 2)}XXX XXX${p.slice(-2)}`;
};

const formatSeconds = (s: number): string =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function OtpScreen() {
  const nav = useNavigation();
  const theme = useTheme();
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);

  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  // Count down to the resend window, ticking every second.
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const submit = useCallback(
    async (code: string) => {
      if (busy || code.length < 6) return;
      setBusy(true);
      setError(null);
      try {
        // Login is reactive — RootNavigator swaps stacks once the token is set.
        await verifyOtp(code.trim());
      } catch (err) {
        setError((err as Error).message);
        setOtp('');
      } finally {
        setBusy(false);
      }
    },
    [busy, verifyOtp],
  );

  const resend = async () => {
    if (secondsLeft > 0 || !pendingPhone) return;
    setError(null);
    setOtp('');
    try {
      await requestOtp(pendingPhone);
      setSecondsLeft(RESEND_SECONDS);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Screen padded>
      <View style={{ flex: 1 }}>
        <Stack gap={6}>
          <AuthTopBar step="STEP 2 OF 2" onBack={() => nav.goBack()} />

          <Stack gap={3}>
            <Text variant="display" style={{ fontSize: 56, lineHeight: 54, letterSpacing: -1.5 }}>
              {'ENTER\nCODE'}
            </Text>
            <Stack direction="row" gap={1} align="center">
              <Text variant="body" tone="muted">
                Sent to +91 {maskPhone(pendingPhone)}
              </Text>
              <Pressable onPress={() => nav.goBack()} hitSlop={8}>
                <Text variant="body" tone="primary" weight="600">
                  Edit
                </Text>
              </Pressable>
            </Stack>
          </Stack>

          <OTPInput value={otp} onChange={setOtp} length={6} autoFocus onComplete={submit} />

          {error ? (
            <Text variant="caption" tone="destructive">
              {error}
            </Text>
          ) : null}

          {secondsLeft > 0 ? (
            <Stack direction="row" gap={1} align="center" justify="center" style={{ paddingVertical: theme.spacing(1) }}>
              <Icon name="timer" size={16} color="mutedForeground" />
              <Text variant="caption" tone="muted">
                Resend code in
              </Text>
              <Text variant="caption" weight="600">
                {formatSeconds(secondsLeft)}
              </Text>
            </Stack>
          ) : (
            <Pressable onPress={resend} style={{ alignItems: 'center', paddingVertical: theme.spacing(1) }}>
              <Text variant="caption" tone="primary" weight="600">
                Resend code
              </Text>
            </Pressable>
          )}
        </Stack>

        <View style={{ flex: 1 }} />

        <Stack gap={4}>
          <AccentPromo title="Secure by default" subtitle="End-to-end encrypted. Code expires in 10 minutes." />
          <Button
            title="Verify"
            fullWidth
            loading={busy}
            disabled={otp.length < 6}
            onPress={() => submit(otp)}
          />
        </Stack>
      </View>
    </Screen>
  );
}
