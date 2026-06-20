import type { ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';

export type ListItemProps = {
  /** Makes the whole row pressable. */
  onPress?: () => void;
  disabled?: boolean;
  children: ReactNode;
};

/**
 * A single row in a list — leading media, a content block, and a trailing
 * control. Composes its sub-components horizontally.
 *
 * Compound API: `ListItem.Leading`, `ListItem.Content`, `ListItem.Title`,
 * `ListItem.Subtitle`, `ListItem.Trailing`.
 *
 * @example
 * <ListItem onPress={open}>
 *   <ListItem.Leading><Avatar member={member} /></ListItem.Leading>
 *   <ListItem.Content>
 *     <ListItem.Title>{member.name}</ListItem.Title>
 *     <ListItem.Subtitle>owes ₹420</ListItem.Subtitle>
 *   </ListItem.Content>
 *   <ListItem.Trailing><Icon name="chevron-right" color="mutedForeground" /></ListItem.Trailing>
 * </ListItem>
 */
function ListItemRoot({ onPress, disabled, children }: ListItemProps) {
  const theme = useTheme();
  const row = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(3),
        paddingVertical: theme.spacing(3),
      }}>
      {children}
    </View>
  );

  if (!onPress) return row;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.6 : 1 })}>
      {row}
    </Pressable>
  );
}

function ListItemLeading({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Grows to fill the space between leading and trailing. */
function ListItemContent({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return <View style={[{ flex: 1, gap: theme.spacing(0.5) }, style]} {...rest} />;
}

function ListItemTitle({ children }: { children: ReactNode }) {
  return (
    <Text variant="body" weight="600" numberOfLines={1}>
      {children}
    </Text>
  );
}

function ListItemSubtitle({ children }: { children: ReactNode }) {
  return (
    <Text variant="caption" tone="muted" numberOfLines={1}>
      {children}
    </Text>
  );
}

function ListItemTrailing({ style, ...rest }: ViewProps) {
  return <View style={[{ marginLeft: 'auto' }, style]} {...rest} />;
}

export const ListItem = Object.assign(ListItemRoot, {
  Leading: ListItemLeading,
  Content: ListItemContent,
  Title: ListItemTitle,
  Subtitle: ListItemSubtitle,
  Trailing: ListItemTrailing,
});
