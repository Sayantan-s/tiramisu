import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  args: { label: 'Split equally', checked: true, onChange: () => {} },
  parameters: { notes: 'Controlled checkbox with an optional inline label.' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [checked, setChecked] = useState(args.checked);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
};
