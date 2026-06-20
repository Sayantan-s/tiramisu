import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { MonthSelector } from './MonthSelector';

const meta = {
  title: 'Organisms/MonthSelector',
  component: MonthSelector,
  args: { value: '2026-04', onChange: () => {} },
  parameters: { notes: 'Horizontally snapping month strip with a bottom-sheet year picker. Drives the month-scoped views.' },
} satisfies Meta<typeof MonthSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [value, setValue] = useState('2026-04');
    return <MonthSelector value={value} onChange={setValue} availableYears={[2024, 2025, 2026]} />;
  },
};
