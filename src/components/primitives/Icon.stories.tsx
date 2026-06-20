import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Icon, iconRegistry, type IconName } from './Icon';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  args: { name: 'wallet', size: 28 },
  argTypes: {
    name: { control: 'select', options: Object.keys(iconRegistry) },
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
  },
  parameters: { notes: 'Themed Lucide icons from a curated registry. Color accepts a theme token name or any color string.' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {(Object.keys(iconRegistry) as IconName[]).map((name) => (
        <View key={name} style={{ width: 72, alignItems: 'center', gap: 4 }}>
          <Icon name={name} size={24} />
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {name}
          </Text>
        </View>
      ))}
    </View>
  ),
};

export const Colors: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Icon name="check-circle" color="successForeground" />
      <Icon name="warning" color="warningForeground" />
      <Icon name="x-circle" color="destructive" />
      <Icon name="wallet" color="primary" />
    </View>
  ),
};
