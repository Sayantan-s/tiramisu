import { Platform } from 'react-native';

// To point at a non-localhost backend during dev, edit this constant.
// (Real env-var injection via react-native-config can come later.)
export const API_BASE_URL: string =
  Platform.select({
    ios: 'http://127.0.0.1:8000',
    android: 'http://10.0.2.2:8000',
    default: 'http://127.0.0.1:8000',
  }) ?? 'http://127.0.0.1:8000';
