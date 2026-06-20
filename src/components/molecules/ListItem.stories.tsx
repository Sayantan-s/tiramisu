import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { ListItem } from './ListItem';
import { Avatar } from '../primitives/Avatar';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { Badge } from '../primitives/Badge';
import { Divider } from '../primitives/Divider';

const meta = {
  title: 'Molecules/ListItem',
  component: ListItem,
  args: { children: null },
  parameters: { notes: 'A list row: leading media, a content block, and a trailing control. Compose ListItem.* sub-components.' },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <ListItem onPress={() => {}}>
      <ListItem.Leading>
        <Avatar member={{ id: 'u1', name: 'Aanya' }} />
      </ListItem.Leading>
      <ListItem.Content>
        <ListItem.Title>Aanya</ListItem.Title>
        <ListItem.Subtitle>owes you ₹420</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Trailing>
        <Icon name="chevron-right" color="mutedForeground" />
      </ListItem.Trailing>
    </ListItem>
  ),
};

export const List: Story = {
  render: () => {
    const members = [
      { id: 'u1', name: 'Aanya', detail: 'owes you ₹420' },
      { id: 'u2', name: 'Rohan', detail: 'settled' },
      { id: 'u3', name: 'Meera', detail: 'you owe ₹180' },
    ];
    return (
      <View>
        {members.map((m, i) => (
          <View key={m.id}>
            <ListItem onPress={() => {}}>
              <ListItem.Leading>
                <Avatar member={m} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>{m.name}</ListItem.Title>
                <ListItem.Subtitle>{m.detail}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Trailing>
                {m.detail === 'settled' ? <Badge label="Settled" tone="success" /> : <Text weight="700">›</Text>}
              </ListItem.Trailing>
            </ListItem>
            {i < members.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </View>
    );
  },
};
