import { createContext, useContext, type ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';
import { Icon, type IconName } from '../primitives/Icon';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

type AlertVisuals = { bg: string; fg: string; icon: IconName };

const AlertContext = createContext<AlertVisuals | null>(null);

const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('Alert.* must be used inside <Alert>');
  return ctx;
};

const ICON_BY_TONE: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  error: 'x-circle',
};

export type AlertProps = {
  tone?: AlertTone;
  children: ReactNode;
};

/**
 * An inline, contextual feedback banner. The `tone` flows to its sub-components
 * via context, so `Alert.Icon` and the text colors match automatically.
 *
 * Compound API: `Alert.Icon`, `Alert.Title`, `Alert.Description`.
 *
 * @example
 * <Alert tone="success">
 *   <Alert.Icon />
 *   <View style={{ flex: 1 }}>
 *     <Alert.Title>All settled</Alert.Title>
 *     <Alert.Description>Everyone's even this month.</Alert.Description>
 *   </View>
 * </Alert>
 */
function AlertRoot({ tone = 'info', children }: AlertProps) {
  const theme = useTheme();
  const c = theme.colors;
  const visuals: AlertVisuals = {
    info: { bg: c.info, fg: c.infoForeground, icon: ICON_BY_TONE.info },
    success: { bg: c.success, fg: c.successForeground, icon: ICON_BY_TONE.success },
    warning: { bg: c.warning, fg: c.warningForeground, icon: ICON_BY_TONE.warning },
    error: { bg: c.error, fg: c.errorForeground, icon: ICON_BY_TONE.error },
  }[tone];

  return (
    <AlertContext.Provider value={visuals}>
      <View
        style={{
          flexDirection: 'row',
          gap: theme.spacing(3),
          backgroundColor: visuals.bg,
          padding: theme.spacing(3),
          borderRadius: theme.radii.md,
        }}>
        {children}
      </View>
    </AlertContext.Provider>
  );
}

/** Renders the tone's default icon, or override via `name`. */
function AlertIcon({ name }: { name?: IconName }) {
  const { fg, icon } = useAlert();
  return <Icon name={name ?? icon} size={20} color={fg} />;
}

function AlertTitle({ children }: { children: ReactNode }) {
  const { fg } = useAlert();
  return (
    <Text variant="label" weight="700" style={{ color: fg }}>
      {children}
    </Text>
  );
}

function AlertDescription({ children }: { children: ReactNode }) {
  const { fg } = useAlert();
  return (
    <Text variant="caption" style={{ color: fg }}>
      {children}
    </Text>
  );
}

export const Alert = Object.assign(AlertRoot, {
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
});
