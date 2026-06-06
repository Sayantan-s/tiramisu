import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Screen, Stack, Text } from '../components';
import { extractFromImage, type OcrResult } from '../lib/ocr';
import { useTheme } from '../theme';
import type { GroupStackParamList } from '../navigation/types';

type R = RouteProp<GroupStackParamList, 'ConfirmCapture'>;
type Nav = NativeStackNavigationProp<GroupStackParamList>;

export function ConfirmCaptureScreen() {
  const route = useRoute<R>();
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const [ocr, setOcr] = useState<OcrResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    extractFromImage(route.params.imageUri).then((r) => {
      if (!cancelled) setOcr(r);
    });
    return () => {
      cancelled = true;
    };
  }, [route.params.imageUri]);

  const proceed = () => {
    if (!ocr) return;
    nav.replace('AddExpense', {
      prefill: {
        amount: ocr.amount,
        description: ocr.merchant,
        receipt_uri: route.params.imageUri,
        source: 'receipt',
      },
    });
  };

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="title">Confirm receipt</Text>
          <Pressable onPress={() => nav.goBack()}>
            <Text variant="title" tone="muted">
              ×
            </Text>
          </Pressable>
        </Stack>

        <Card padding={2}>
          <Image
            source={{ uri: route.params.imageUri }}
            style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: 12 }}
            resizeMode="cover"
          />
        </Card>

        {!ocr ? (
          <Card padding={5}>
            <Stack direction="row" gap={3} align="center">
              <ActivityIndicator color={theme.colors.accent} />
              <Text tone="muted">Reading the receipt…</Text>
            </Stack>
          </Card>
        ) : (
          <Card padding={5}>
            <Stack gap={3}>
              <Stack direction="row" justify="space-between">
                <Text tone="muted" variant="caption">MERCHANT</Text>
                <Text tone="muted" variant="caption">
                  {Math.round(ocr.confidence * 100)}% confidence
                </Text>
              </Stack>
              <Text variant="heading">{ocr.merchant ?? 'Unknown'}</Text>
              <Text tone="muted" variant="caption">AMOUNT</Text>
              <Text variant="title">₹{((ocr.amount ?? 0) / 100).toFixed(2)}</Text>
              <Text tone="muted" variant="caption">
                You can edit these on the next screen.
              </Text>
            </Stack>
          </Card>
        )}

        <Button title="Continue" fullWidth disabled={!ocr} onPress={proceed} />
      </Stack>
    </Screen>
  );
}
