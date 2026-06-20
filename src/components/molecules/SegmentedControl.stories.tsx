import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Molecules/SegmentedControl',
  component: SegmentedControl,
  args: { value: 'all', onChange: () => {}, options: [] },
  parameters: { notes: 'Pill-shaped single-select toggle between a small set of options.' },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [value, setValue] = useState('all');
    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          { value: 'all', label: 'All' },
          { value: 'mine', label: 'Mine' },
          { value: 'settled', label: 'Settled' },
        ]}
      />
    );
  },
};
