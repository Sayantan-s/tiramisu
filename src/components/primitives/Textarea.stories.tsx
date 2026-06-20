import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  args: { label: 'Note', placeholder: 'Add a note…', rows: 4, maxLength: 140, showCount: true },
  parameters: { notes: 'Multi-line text field, sized to rows, with an optional character counter.' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [value, setValue] = useState('');
    return <Textarea {...args} value={value} onChangeText={setValue} />;
  },
};
