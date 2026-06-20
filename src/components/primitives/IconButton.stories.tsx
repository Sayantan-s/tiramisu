import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { IconButton } from './IconButton';

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  args: { icon: 'plus', accessibilityLabel: 'Add', variant: 'primary', size: 'md', onPress: () => {} },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: { notes: 'Square, icon-only button. Always pass an accessibilityLabel.' },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <IconButton icon="plus" accessibilityLabel="Add" variant="primary" />
      <IconButton icon="settings" accessibilityLabel="Settings" variant="secondary" />
      <IconButton icon="share" accessibilityLabel="Share" variant="outline" />
      <IconButton icon="bell" accessibilityLabel="Alerts" variant="ghost" />
      <IconButton icon="trash" accessibilityLabel="Delete" variant="destructive" />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <IconButton icon="plus" accessibilityLabel="Add" size="sm" />
      <IconButton icon="plus" accessibilityLabel="Add" size="md" />
      <IconButton icon="plus" accessibilityLabel="Add" size="lg" />
    </View>
  ),
};
