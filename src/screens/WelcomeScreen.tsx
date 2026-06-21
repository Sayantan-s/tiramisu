import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Pressable, View } from 'react-native';
import { Button, Screen, Stack, Text } from '../components';
import { useTheme } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

const HERO = require('../assets/images/auth-hero.png');

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function WelcomeScreen() {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  // "Sign in" and "Get started" are the same passwordless OTP path.
  const start = () => nav.navigate('Phone');

  return (
    <Screen padded={false}>
      <View style={{ flex: 1, paddingBottom: theme.spacing(8) }}>
        <Stack gap={3} style={{ paddingHorizontal: theme.spacing(6), paddingTop: theme.spacing(4) }}>
          <Stack direction="row" gap={2} align="center">
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary }} />
            <Text variant="caption" tone="muted" weight="600" style={{ letterSpacing: 1.8 }}>
              WELCOME TO
            </Text>
          </Stack>
          <Text variant="display" style={{ fontSize: 64, lineHeight: 62, letterSpacing: -1.5 }}>
            TIRAMISU
          </Text>
          <Text variant="display" tone="primary" style={{ fontSize: 38, lineHeight: 38, letterSpacing: -1 }}>
            {'Split rent.\nSplit bills.\nStay friends.'}
          </Text>
        </Stack>

        <Image
          source={HERO}
          resizeMode="cover"
          style={{
            flex: 1,
            marginHorizontal: theme.spacing(6),
            marginTop: theme.spacing(5),
            borderRadius: theme.radii.lg,
          }}
        />

        <Stack gap={3} style={{ paddingHorizontal: theme.spacing(6), paddingTop: theme.spacing(5) }}>
          <Button title="Get started" fullWidth onPress={start} />
          <Pressable onPress={start} style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <Text variant="caption" tone="muted">
              Already have an account?
            </Text>
            <Text variant="caption" tone="primary" weight="600">
              Sign in
            </Text>
          </Pressable>
        </Stack>
      </View>
    </Screen>
  );
}
