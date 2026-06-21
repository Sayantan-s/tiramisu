import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Button, Icon, Input, Screen, Stack, Text } from '../components';
import { useTheme } from '../theme';
import { useAuthStore } from '../features/auth/store';
import type { AuthStackParamList } from '../navigation/types';
import { AccentPromo, AuthTopBar } from './auth/AuthParts';

const PROMO = require('../assets/images/auth-promo.png');

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function PhoneScreen() {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = phone.length >= 10;

  const submit = async () => {
    if (busy || !valid) return;
    setBusy(true);
    setError(null);
    try {
      await requestOtp(phone);
      nav.navigate('Otp');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scrollable>
      <Stack gap={6}>
        <AuthTopBar step="STEP 1 OF 2" onBack={() => nav.goBack()} />

        <Stack gap={3}>
          <Text variant="display" style={{ fontSize: 40, lineHeight: 40, letterSpacing: -1 }}>
            {"WHAT'S\nYOUR NUMBER?"}
          </Text>
          <Text variant="body" tone="muted">
            We'll text a 6-digit code to verify it's really you. Standard SMS rates may apply.
          </Text>
        </Stack>

        <Stack direction="row" gap={2} align="flex-end">
          <View style={{ gap: theme.spacing(1) }}>
            <Text variant="label" tone="muted">
              CODE
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing(2),
                backgroundColor: theme.colors.muted,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: theme.colors.input,
                paddingHorizontal: theme.spacing(3),
                paddingVertical: theme.spacing(3),
              }}>
              <Text variant="body">🇮🇳</Text>
              <Text variant="body" weight="600">
                +91
              </Text>
              <Icon name="chevron-down" size={16} color="mutedForeground" />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Input
              label="PHONE NUMBER"
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              keyboardType="phone-pad"
              autoFocus
              maxLength={10}
              error={error ?? undefined}
            />
          </View>
        </Stack>

        <Alert tone="info">
          <Alert.Icon name="info" />
          <View style={{ flex: 1 }}>
            <Alert.Description>
              We never share your number. Roommates only see it once you're in the same MonthRoom.
            </Alert.Description>
          </View>
        </Alert>

        <AccentPromo title={'Your\nmonth-end,\nsorted'} subtitle="Rent · Wifi · Maid · Milk" image={PROMO} />

        <Button title="Continue" fullWidth loading={busy} disabled={!valid} onPress={submit} />
      </Stack>
    </Screen>
  );
}
