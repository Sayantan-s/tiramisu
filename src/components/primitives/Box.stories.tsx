import type { Meta, StoryObj } from '@storybook/react-native';
import { Box } from './Box';
import { Stack } from './Stack';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Layout (Box & Stack)',
  component: Box,
  parameters: { notes: 'Box is a themed View (padding/gap/surface/radius/border tokens). Stack is a flex container with a token-driven gap.' },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surfaces: Story = {
  render: () => (
    <Stack gap={3}>
      <Box background="card" radius="lg" padding={4} bordered>
        <Text>card surface</Text>
      </Box>
      <Box background="muted" radius="md" padding={4}>
        <Text>muted surface</Text>
      </Box>
      <Box background="tile" radius="md" padding={4}>
        <Text>tile surface</Text>
      </Box>
    </Stack>
  ),
};

export const StackDirections: Story = {
  render: () => (
    <Stack gap={4}>
      <Stack direction="row" gap={2}>
        <Box background="muted" padding={3} radius="sm">
          <Text>1</Text>
        </Box>
        <Box background="muted" padding={3} radius="sm">
          <Text>2</Text>
        </Box>
        <Box background="muted" padding={3} radius="sm">
          <Text>3</Text>
        </Box>
      </Stack>
      <Stack gap={2}>
        <Box background="muted" padding={3} radius="sm">
          <Text>A</Text>
        </Box>
        <Box background="muted" padding={3} radius="sm">
          <Text>B</Text>
        </Box>
      </Stack>
    </Stack>
  ),
};
