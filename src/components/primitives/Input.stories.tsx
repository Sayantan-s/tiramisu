import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { Input } from './Input';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  args: { label: 'Amount', placeholder: '0', prefix: '₹', keyboardType: 'numeric' },
  parameters: { notes: 'Single-line text field with focus ring, label, prefix, and error support.' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [value, setValue] = useState('');
    return <Input {...args} value={value} onChangeText={setValue} />;
  },
};

export const States: Story = {
  render: function States() {
    const [a, setA] = useState('480');
    const [b, setB] = useState('');
    return (
      <View style={{ gap: 16 }}>
        <Input label="Filled" prefix="₹" value={a} onChangeText={setA} keyboardType="numeric" />
        <Input label="Email" placeholder="you@example.com" value={b} onChangeText={setB} error="Enter a valid email" />
      </View>
    );
  },
};
