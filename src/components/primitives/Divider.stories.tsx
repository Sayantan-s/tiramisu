import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Divider } from './Divider';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: { notes: 'A one-pixel hairline using the border token.' },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Text>Above</Text>
      <Divider />
      <Text>Below</Text>
    </View>
  ),
};

export const Vertical: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', height: 24, alignItems: 'center', gap: 12 }}>
      <Text>Left</Text>
      <Divider orientation="vertical" />
      <Text>Right</Text>
    </View>
  ),
};
