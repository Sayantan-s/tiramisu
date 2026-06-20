import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { useTheme, type ThemeColors, type ThemeRadii } from '../theme';
import { Text } from './primitives/Text';

/** Living documentation of the design tokens — the code version of Pencil section 01. */
function Foundations() {
  const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={{ gap: 28 }}>
      <Section title="Colors">
        <Swatches names={SWATCH_TOKENS} />
      </Section>

      <Section title="Status surfaces">
        <Swatches names={['success', 'warning', 'info', 'error']} />
      </Section>

      <Section title="Typography">
        <Text variant="display">Display</Text>
        <Text variant="title">Title</Text>
        <Text variant="heading">Heading</Text>
        <Text variant="body">Body — the quick brown fox.</Text>
        <Text variant="label">Label</Text>
        <Text variant="caption" tone="muted">
          Caption
        </Text>
      </Section>

      <Section title="Spacing (×4px)">
        <View style={{ gap: 8 }}>
          {[1, 2, 3, 4, 6, 8].map((n) => (
            <View key={n} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text variant="caption" tone="muted" style={{ width: 48 }}>
                spacing({n})
              </Text>
              <View style={{ height: 16, width: theme.spacing(n), backgroundColor: theme.colors.primary, borderRadius: 4 }} />
            </View>
          ))}
        </View>
      </Section>

      <Section title="Radii">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {(['xs', 'sm', 'md', 'lg', 'xl', 'm', 'l'] as Array<keyof ThemeRadii>).map((r) => (
            <View key={r} style={{ alignItems: 'center', gap: 4 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: theme.colors.muted,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radii[r],
                }}
              />
              <Text variant="caption" tone="muted">
                {r} · {theme.radii[r]}
              </Text>
            </View>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

const SWATCH_TOKENS: Array<keyof ThemeColors> = [
  'background',
  'foreground',
  'card',
  'primary',
  'secondary',
  'muted',
  'mutedForeground',
  'destructive',
  'border',
  'ring',
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Text variant="heading">{title}</Text>
      {children}
    </View>
  );
}

function Swatches({ names }: { names: Array<keyof ThemeColors> }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {names.map((name) => (
        <View key={name} style={{ width: 96, gap: 4 }}>
          <View
            style={{
              height: 48,
              borderRadius: theme.radii.sm,
              backgroundColor: theme.colors[name],
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          />
          <Text variant="caption" numberOfLines={1}>
            {name}
          </Text>
          <Text variant="caption" tone="muted">
            {theme.colors[name]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const meta = {
  title: 'Foundations/Tokens',
  component: Foundations,
  parameters: { notes: 'Colors, typography, spacing, and radii — sourced from the Pencil design file.' },
} satisfies Meta<typeof Foundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = { parameters: { theme: 'light' } };
export const Dark: Story = { parameters: { theme: 'dark' } };
