import type { Meta, StoryObj } from '@storybook/react-native';
import { Accordion } from './Accordion';
import { Text } from '../primitives/Text';

const meta = {
  title: 'Organisms/Accordion',
  component: Accordion,
  args: { children: null },
  parameters: { notes: 'Expandable panels with animated height. Compose Accordion.Item / Trigger / Content.' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <Accordion defaultValue="rent">
      <Accordion.Item value="rent">
        <Accordion.Trigger>Rent</Accordion.Trigger>
        <Accordion.Content>
          <Text tone="muted">₹18,000 split 3 ways — ₹6,000 each.</Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="utilities">
        <Accordion.Trigger>Utilities</Accordion.Trigger>
        <Accordion.Content>
          <Text tone="muted">Electricity + internet, ₹2,400 total.</Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="groceries">
        <Accordion.Trigger>Groceries</Accordion.Trigger>
        <Accordion.Content>
          <Text tone="muted">Big Bazaar run, ₹3,150.</Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion multiple defaultValue={['a', 'b']}>
      <Accordion.Item value="a">
        <Accordion.Trigger>First</Accordion.Trigger>
        <Accordion.Content>
          <Text tone="muted">Open by default.</Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Second</Accordion.Trigger>
        <Accordion.Content>
          <Text tone="muted">Also open — multiple allows several at once.</Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};
