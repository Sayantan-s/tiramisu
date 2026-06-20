import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Select } from './Select';

const meta = {
  title: 'Organisms/Select',
  component: Select,
  args: { value: null, onChange: () => {}, options: [] },
  parameters: { notes: 'A field-like trigger that opens a bottom-sheet option list. Requires a BottomSheetModalProvider ancestor.' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <Select
        value={value}
        onChange={setValue}
        title="Category"
        placeholder="Pick a category"
        options={[
          { value: 'rent', label: 'Rent' },
          { value: 'food', label: 'Food & groceries' },
          { value: 'bills', label: 'Bills & utilities' },
          { value: 'fun', label: 'Going out' },
        ]}
      />
    );
  },
};
