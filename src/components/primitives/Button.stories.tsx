import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { title: 'Add expense', variant: 'primary', size: 'md', onPress: () => {} },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: { notes: 'Pill-shaped call-to-action. Supports leading/trailing icons and a loading state.' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Button title="Primary" variant="primary" />
      <Button title="Secondary" variant="secondary" />
      <Button title="Outline" variant="outline" />
      <Button title="Ghost" variant="ghost" />
      <Button title="Destructive" variant="destructive" />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Button title="Small" size="sm" />
      <Button title="Medium" size="md" />
      <Button title="Large" size="lg" />
    </View>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Button title="Add expense" leadingIcon="plus" />
      <Button title="Continue" trailingIcon="arrow-right" variant="secondary" />
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Button title="Loading" loading />
      <Button title="Disabled" disabled />
      <Button title="Full width" fullWidth />
    </View>
  ),
};

export const OnDark: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Button title="Primary" variant="primary" />
      <Button title="Outline" variant="outline" />
      <Button title="Ghost" variant="ghost" />
    </View>
  ),
};
