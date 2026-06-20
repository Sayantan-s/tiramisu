import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Badge } from './Badge';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { label: 'Settled', tone: 'success', appearance: 'soft' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'primary', 'success', 'warning', 'info', 'error'] },
    appearance: { control: 'inline-radio', options: ['soft', 'solid'] },
  },
  parameters: { notes: 'Small status pill for labels, counts, and statuses.' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Soft: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Badge label="Neutral" tone="neutral" />
      <Badge label="Primary" tone="primary" />
      <Badge label="Success" tone="success" />
      <Badge label="Warning" tone="warning" />
      <Badge label="Info" tone="info" />
      <Badge label="Error" tone="error" />
    </View>
  ),
};

export const Solid: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Badge label="Neutral" tone="neutral" appearance="solid" />
      <Badge label="Primary" tone="primary" appearance="solid" />
      <Badge label="Error" tone="error" appearance="solid" />
    </View>
  ),
};

export const WithIcon: Story = {
  args: { label: 'Pending', tone: 'warning', icon: 'warning' },
};
