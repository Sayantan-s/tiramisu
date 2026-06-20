import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Text',
  component: Text,
  args: { children: 'Split it fair.', variant: 'body', tone: 'default' },
  argTypes: {
    variant: { control: 'select', options: ['display', 'title', 'heading', 'body', 'label', 'caption'] },
    tone: { control: 'select', options: ['default', 'muted', 'primary', 'destructive', 'success', 'inverse'] },
  },
  parameters: {
    notes: 'The single text primitive. Always render copy through Text so it inherits the type scale, fonts, and themed colors.',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text variant="display">Display</Text>
      <Text variant="title">Title</Text>
      <Text variant="heading">Heading</Text>
      <Text variant="body">Body</Text>
      <Text variant="label">Label</Text>
      <Text variant="caption">Caption</Text>
    </View>
  ),
};

export const Tones: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text tone="default">Default</Text>
      <Text tone="muted">Muted</Text>
      <Text tone="primary">Primary</Text>
      <Text tone="destructive">Destructive</Text>
      <Text tone="success">Success</Text>
    </View>
  ),
};
