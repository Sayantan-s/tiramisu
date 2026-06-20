import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { Radio } from './Radio';

const meta = {
  title: 'Primitives/Radio',
  component: Radio,
  args: { label: 'UPI', selected: true, onPress: () => {} },
  parameters: { notes: 'A single radio option. Group with RadioGroup for managed selection.' },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [selected, setSelected] = useState(args.selected);
    return <Radio {...args} selected={selected} onPress={() => setSelected((s) => !s)} />;
  },
};

export const Group: Story = {
  render: function Group() {
    const [value, setValue] = useState('upi');
    return (
      <View style={{ gap: 12 }}>
        {['upi', 'cash', 'card'].map((v) => (
          <Radio key={v} label={v.toUpperCase()} selected={value === v} onPress={() => setValue(v)} />
        ))}
      </View>
    );
  },
};
