import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { Card, Button, Screen, Stack, Text } from '../components';
import { useTheme } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ScanScreen() {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const focused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const photoOutput = usePhotoOutput();
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const capture = async () => {
    if (capturing) return;
    setCapturing(true);
    try {
      const photoFile = await photoOutput.capturePhotoToFile({ flashMode: 'off' }, {});
      const uri = photoFile.filePath.startsWith('file://')
        ? photoFile.filePath
        : `file://${photoFile.filePath}`;
      nav.navigate('ConfirmCapture', { imageUri: uri });
    } catch (err) {
      console.warn('capture failed', err);
    } finally {
      setCapturing(false);
    }
  };

  if (!hasPermission) {
    return (
      <Screen padded>
        <Stack gap={4}>
          <Text variant="title">Camera access needed</Text>
          <Text tone="muted">
            We use the camera only to capture receipts. The image stays on this device.
          </Text>
          <Button title="Grant access" onPress={requestPermission} fullWidth />
        </Stack>
      </Screen>
    );
  }

  if (!device) {
    return (
      <Screen padded>
        <Stack gap={3}>
          <Text variant="title">No camera available</Text>
          <Text tone="muted">Try a real device or simulator with a camera.</Text>
        </Stack>
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={focused}
        outputs={[photoOutput]}
      />
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 60,
          left: 24,
          right: 24,
        }}>
        <Card variant="muted" padding={3} style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <Text variant="caption" weight="700" style={{ color: '#fff', letterSpacing: 1.5 }}>
            ALIGN THE RECEIPT
          </Text>
          <Text style={{ color: '#fff' }}>
            Place the receipt on a flat surface and capture.
          </Text>
        </Card>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 56,
          left: 0,
          right: 0,
          alignItems: 'center',
          gap: theme.spacing(3),
        }}>
        <Pressable
          onPress={capture}
          disabled={capturing}
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            backgroundColor: capturing ? '#888' : '#fff',
            borderWidth: 6,
            borderColor: 'rgba(255,255,255,0.35)',
          }}
        />
        <Text style={{ color: '#fff' }} variant="caption">
          {capturing ? 'Capturing…' : 'Tap to capture'}
        </Text>
      </View>
    </View>
  );
}
