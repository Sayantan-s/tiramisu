import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Card } from './Card';
import { Text } from '../primitives/Text';
import { Button } from '../primitives/Button';
import { IconButton } from '../primitives/IconButton';
import { Badge } from '../primitives/Badge';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  args: { variant: 'elevated', padding: 4 },
  argTypes: { variant: { control: 'inline-radio', options: ['elevated', 'muted', 'outlined'] } },
  parameters: { notes: 'A surface for grouping content. Compose Card.Header / Title / Content / Footer / Action.' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  render: (args) => (
    <Card {...args}>
      <Text variant="heading">April rent</Text>
      <Text tone="muted">Split 3 ways · ₹6,000 each</Text>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {(['elevated', 'muted', 'outlined'] as const).map((v) => (
        <Card key={v} variant={v}>
          <Text weight="600">{v}</Text>
        </Card>
      ))}
    </View>
  ),
};

export const Composed: Story = {
  render: () => (
    <Card padding={0}>
      <Card.Header>
        <Card.Title>April rent</Card.Title>
        <Card.Action>
          <IconButton icon="more-horizontal" accessibilityLabel="More" variant="ghost" size="sm" />
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <Text tone="muted">Split 3 ways</Text>
        <View style={{ marginTop: 8 }}>
          <Badge label="Pending" tone="warning" />
        </View>
      </Card.Content>
      <Card.Footer>
        <Button title="Settle up" size="sm" />
        <Button title="Details" size="sm" variant="ghost" />
      </Card.Footer>
    </Card>
  ),
};
