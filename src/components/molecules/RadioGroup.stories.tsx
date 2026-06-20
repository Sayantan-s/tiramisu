import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Molecules/RadioGroup',
  component: RadioGroup,
  args: { value: 'upi', onChange: () => {}, children: null },
  parameters: { notes: 'Single-selection across RadioGroup.Item children, managed via context.' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [value, setValue] = useState('upi');
    return (
      <RadioGroup value={value} onChange={setValue}>
        <RadioGroup.Item value="upi" label="UPI" />
        <RadioGroup.Item value="cash" label="Cash" />
        <RadioGroup.Item value="card" label="Card" />
      </RadioGroup>
    );
  },
};
