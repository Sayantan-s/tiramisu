import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { Switch } from './Switch';

const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  args: { value: true, onValueChange: () => {} },
  parameters: { notes: 'Controlled on/off toggle with an animated thumb.' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [on, setOn] = useState(true);
    return <Switch value={on} onValueChange={setOn} accessibilityLabel="Toggle" />;
  },
};

export const States: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Switch value onValueChange={() => {}} accessibilityLabel="On" />
      <Switch value={false} onValueChange={() => {}} accessibilityLabel="Off" />
      <Switch value disabled onValueChange={() => {}} accessibilityLabel="Disabled" />
    </View>
  ),
};
