import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text, type TextProps } from '../primitives/Text';

export type CardVariant = 'elevated' | 'muted' | 'outlined';

export type CardProps = ViewProps & {
  variant?: CardVariant;
  /** Inner padding in spacing units. Set to 0 when composing with Card.* sections. */
  padding?: number;
};

/**
 * A surface for grouping related content. Use it bare for simple cases, or
 * compose the section sub-components for structured cards.
 *
 * Compound API:
 * - `Card.Header` — top row (often a title + an action)
 * - `Card.Title` — heading text
 * - `Card.Content` — body region
 * - `Card.Footer` — bottom row
 * - `Card.Action` — pushes a trailing control to the right of a header
 *
 * @example
 * <Card padding={0}>
 *   <Card.Header>
 *     <Card.Title>April rent</Card.Title>
 *     <Card.Action><IconButton icon="more-horizontal" accessibilityLabel="More" variant="ghost" /></Card.Action>
 *   </Card.Header>
 *   <Card.Content><Text tone="muted">Split 3 ways</Text></Card.Content>
 *   <Card.Footer><Button title="Settle up" /></Card.Footer>
 * </Card>
 */
function CardRoot({ variant = 'elevated', padding = 4, style, ...rest }: CardProps) {
  const theme = useTheme();
  const byVariant: ViewStyle =
    variant === 'muted'
      ? { backgroundColor: theme.colors.muted }
      : variant === 'outlined'
        ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border }
        : {
            backgroundColor: theme.colors.card,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          };

  return <View style={[{ borderRadius: theme.radii.lg, padding: theme.spacing(padding) }, byVariant, style]} {...rest} />;
}

function CardHeader({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing(4), paddingBottom: theme.spacing(2) },
        style,
      ]}
      {...rest}
    />
  );
}

function CardTitle(props: TextProps) {
  return <Text variant="heading" {...props} />;
}

function CardContent({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return <View style={[{ paddingHorizontal: theme.spacing(4), paddingVertical: theme.spacing(2) }, style]} {...rest} />;
}

function CardFooter({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2), padding: theme.spacing(4), paddingTop: theme.spacing(2) },
        style,
      ]}
      {...rest}
    />
  );
}

function CardAction({ style, ...rest }: ViewProps) {
  return <View style={[{ marginLeft: 'auto' }, style]} {...rest} />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
  Footer: CardFooter,
  Action: CardAction,
});
