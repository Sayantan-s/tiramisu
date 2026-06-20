import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { OTPInput } from './OTPInput';

const meta = {
  title: 'Primitives/OTPInput',
  component: OTPInput,
  args: { length: 6, value: '', onChange: () => {} },
  parameters: { notes: 'One-time-code field rendered as boxes backed by a single hidden numeric input.' },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [code, setCode] = useState('');
    return <OTPInput {...args} value={code} onChange={setCode} />;
  },
};
