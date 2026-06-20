import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from '../primitives/Button';
import { Text } from '../primitives/Text';

const meta = {
  title: 'Organisms/BottomSheet',
  component: BottomSheet,
  args: { open: false, onClose: () => {}, children: null },
  parameters: {
    notes: 'Themed bottom sheet over @gorhom/bottom-sheet. Controlled via `open`. Requires a BottomSheetModalProvider ancestor (present in the Storybook preview).',
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button title="Open sheet" onPress={() => setOpen(true)} />
        <BottomSheet open={open} onClose={() => setOpen(false)} snapPoints={['40%']}>
          <BottomSheet.Header onClose={() => setOpen(false)}>Filters</BottomSheet.Header>
          <BottomSheet.Content>
            <Text tone="muted">Tap the backdrop or swipe down to dismiss.</Text>
            <Button title="Apply" fullWidth onPress={() => setOpen(false)} />
          </BottomSheet.Content>
        </BottomSheet>
      </>
    );
  },
};
