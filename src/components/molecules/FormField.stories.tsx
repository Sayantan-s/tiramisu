import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { FormField } from './FormField';
import { Input } from '../primitives/Input';
import { Textarea } from '../primitives/Textarea';

const meta = {
  title: 'Molecules/FormField',
  component: FormField,
  args: { children: null },
  parameters: { notes: 'Groups label, control, hint, and error. The error/disabled state flows to sub-components via context.' },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHint: Story = {
  render: function WithHint() {
    const [value, setValue] = useState('');
    return (
      <FormField>
        <FormField.Label>Amount</FormField.Label>
        <FormField.Control>
          <Input prefix="₹" keyboardType="numeric" value={value} onChangeText={setValue} />
        </FormField.Control>
        <FormField.Hint>Per person, before tax</FormField.Hint>
        <FormField.Error />
      </FormField>
    );
  },
};

export const WithError: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <FormField error="Required">
        <FormField.Label>Title</FormField.Label>
        <FormField.Control>
          <Input placeholder="e.g. Groceries" />
        </FormField.Control>
        <FormField.Hint>Hidden while there is an error</FormField.Hint>
        <FormField.Error />
      </FormField>
      <FormField disabled>
        <FormField.Label>Note (disabled)</FormField.Label>
        <FormField.Control>
          <Textarea rows={3} />
        </FormField.Control>
      </FormField>
    </View>
  ),
};
