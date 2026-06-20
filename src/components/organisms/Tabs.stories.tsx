import type { Meta, StoryObj } from '@storybook/react-native';
import { Tabs } from './Tabs';
import { Text } from '../primitives/Text';

const meta = {
  title: 'Organisms/Tabs',
  component: Tabs,
  args: { defaultValue: 'owed', children: null },
  parameters: { notes: 'Underlined tab triggers with swappable panels. Compose Tabs.List / Trigger / Content.' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Tabs defaultValue="owed">
      <Tabs.List>
        <Tabs.Trigger value="owed">You owe</Tabs.Trigger>
        <Tabs.Trigger value="owes">Owed to you</Tabs.Trigger>
        <Tabs.Trigger value="all">All</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="owed">
        <Text tone="muted">You owe ₹180 to Meera.</Text>
      </Tabs.Content>
      <Tabs.Content value="owes">
        <Text tone="muted">Aanya owes you ₹420.</Text>
      </Tabs.Content>
      <Tabs.Content value="all">
        <Text tone="muted">3 open balances this month.</Text>
      </Tabs.Content>
    </Tabs>
  ),
};
