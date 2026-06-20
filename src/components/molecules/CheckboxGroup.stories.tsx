import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { CheckboxGroup } from './CheckboxGroup';

const meta = {
  title: 'Molecules/CheckboxGroup',
  component: CheckboxGroup,
  args: { value: [], onChange: () => {}, children: null },
  parameters: { notes: 'Multi-selection across CheckboxGroup.Item children, managed via context.' },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [value, setValue] = useState<string[]>(['u1']);
    return (
      <CheckboxGroup value={value} onChange={setValue}>
        <CheckboxGroup.Item value="u1" label="Aanya" />
        <CheckboxGroup.Item value="u2" label="Rohan" />
        <CheckboxGroup.Item value="u3" label="Meera" />
      </CheckboxGroup>
    );
  },
};
