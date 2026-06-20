import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Avatar } from './Avatar';

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  args: { member: { id: 'u1', name: 'Aanya' }, size: 48, ring: false },
  parameters: { notes: 'Circular member avatar. Shows an emoji if present, else an initial on a color derived from the id.' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar member={{ id: 'u1', name: 'Aanya' }} />
      <Avatar member={{ id: 'u2', name: 'Rohan' }} />
      <Avatar member={{ id: 'u3', name: 'Meera', avatar: '🧑‍🍳' }} />
      <Avatar member={{ id: 'u4', name: 'Dev' }} ring />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar member={{ id: 'u1', name: 'Aanya' }} size={28} />
      <Avatar member={{ id: 'u1', name: 'Aanya' }} size={40} />
      <Avatar member={{ id: 'u1', name: 'Aanya' }} size={56} />
    </View>
  ),
};
