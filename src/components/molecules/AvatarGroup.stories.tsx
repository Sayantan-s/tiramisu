import type { Meta, StoryObj } from '@storybook/react-native';
import { AvatarGroup } from './AvatarGroup';

const members = [
  { id: 'u1', name: 'Aanya' },
  { id: 'u2', name: 'Rohan' },
  { id: 'u3', name: 'Meera' },
  { id: 'u4', name: 'Dev' },
  { id: 'u5', name: 'Sara' },
  { id: 'u6', name: 'Kabir' },
];

const meta = {
  title: 'Molecules/AvatarGroup',
  component: AvatarGroup,
  args: { members, size: 40, max: 4 },
  argTypes: { max: { control: { type: 'range', min: 1, max: 6, step: 1 } } },
  parameters: { notes: 'Overlapping avatars with a +N overflow badge.' },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
