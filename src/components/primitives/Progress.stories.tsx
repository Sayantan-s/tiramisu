import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Progress } from './Progress';

const meta = {
  title: 'Primitives/Progress',
  component: Progress,
  args: { value: 0.65, height: 8, tone: 'primary' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    tone: { control: 'inline-radio', options: ['primary', 'success', 'destructive'] },
  },
  parameters: { notes: 'Determinate progress bar; value is clamped to 0–1.' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Progress value={0.4} tone="primary" />
      <Progress value={0.75} tone="success" />
      <Progress value={0.9} tone="destructive" />
    </View>
  ),
};
