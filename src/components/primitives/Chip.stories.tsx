import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { Chip } from './Chip';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  args: { label: 'Groceries', selected: false },
  parameters: { notes: 'A selectable pill — used for filters and single/multi choice rows.' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Chip label="Unselected" />
      <Chip label="Selected" selected />
      <Chip label="With icon" icon="wallet" selected />
    </View>
  ),
};

export const FilterRow: Story = {
  render: function FilterRow() {
    const options = ['All', 'Rent', 'Food', 'Bills'];
    const [active, setActive] = useState('All');
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => (
          <Chip key={o} label={o} selected={o === active} onPress={() => setActive(o)} />
        ))}
      </View>
    );
  },
};
