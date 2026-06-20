import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Alert } from './Alert';

const meta = {
  title: 'Molecules/Alert',
  component: Alert,
  args: { tone: 'info', children: null },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] } },
  parameters: { notes: 'Inline feedback banner. Tone flows to Alert.Icon and the text colors via context.' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Alert {...args}>
      <Alert.Icon />
      <View style={{ flex: 1 }}>
        <Alert.Title>Heads up</Alert.Title>
        <Alert.Description>Rohan hasn't settled April yet.</Alert.Description>
      </View>
    </Alert>
  ),
};

export const AllTones: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {(['info', 'success', 'warning', 'error'] as const).map((tone) => (
        <Alert key={tone} tone={tone}>
          <Alert.Icon />
          <View style={{ flex: 1 }}>
            <Alert.Title>{tone[0].toUpperCase() + tone.slice(1)}</Alert.Title>
            <Alert.Description>This is a {tone} message.</Alert.Description>
          </View>
        </Alert>
      ))}
    </View>
  ),
};
