import { useMemo, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Avatar, Button, Card, Input, Screen, Stack, Text } from '../components';
import { useGroupsStore } from '../features/groups/store';
import { useExpensesStore } from '../features/expenses/store';
import { useEventsStore } from '../features/events/store';
import { useAuthStore } from '../features/auth/store';
import { splitByRule } from '../lib/split';
import { formatINR, formatFullDate } from '../lib/format';
import { useTheme } from '../theme';
import type { GroupStackParamList } from '../navigation/types';

type R = RouteProp<GroupStackParamList, 'ExpenseDetail'>;

const SPLIT_LABELS: Record<string, string> = {
  equal: 'Split equally',
  shares: 'Split by shares',
  percent: 'Split by percentage',
  exact: 'Split by exact amounts',
  itemized: 'Itemized split',
};

export function ExpenseDetailScreen() {
  const nav = useNavigation();
  const route = useRoute<R>();
  const theme = useTheme();

  const expense = useExpensesStore((s) => s.expenses.find((e) => e.id === route.params.expenseId));
  const removeExpense = useExpensesStore((s) => s.removeExpense);
  const { groups, activeGroupId } = useGroupsStore();
  const group = groups.find((g) => g.id === activeGroupId);
  const events = useEventsStore((s) => s.events);
  const postComment = useEventsStore((s) => s.postComment);
  const me = useAuthStore((s) => s.user);

  const [commentBody, setCommentBody] = useState('');
  const [busy, setBusy] = useState(false);

  const comments = useMemo(
    () => events.filter((e) => e.kind === 'comment' && e.subject_id === route.params.expenseId),
    [events, route.params.expenseId],
  );

  if (!expense || !group) {
    return (
      <Screen padded>
        <Stack gap={4}>
          <Text variant="title">Expense not found</Text>
          <Button title="Close" onPress={() => nav.goBack()} />
        </Stack>
      </Screen>
    );
  }

  const payer = group.members.find((m) => m.id === expense.payer_id);
  const shares = splitByRule(expense.amount, expense.split);
  const memberName = (id: string) => group.members.find((m) => m.id === id)?.name ?? '?';

  const submitComment = async () => {
    if (busy || !commentBody.trim()) return;
    setBusy(true);
    try {
      await postComment(expense.id, commentBody.trim());
      setCommentBody('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="title">Expense</Text>
          <Pressable onPress={() => nav.goBack()}>
            <Text variant="title" tone="muted">×</Text>
          </Pressable>
        </Stack>

        <Card padding={5}>
          <Stack gap={2}>
            <Text variant="caption" tone="muted">{expense.category.toUpperCase()}</Text>
            <Text variant="display">{formatINR(expense.amount)}</Text>
            {expense.description ? <Text variant="body">{expense.description}</Text> : null}
            <Text variant="caption" tone="muted">
              {formatFullDate(expense.paid_at)} · source: {expense.source}
            </Text>
          </Stack>
        </Card>

        {expense.receipt_uri ? (
          <Card padding={2}>
            <Image
              source={{ uri: expense.receipt_uri }}
              style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: 12 }}
              resizeMode="cover"
            />
          </Card>
        ) : null}

        <Stack gap={2}>
          <Text variant="caption" tone="muted">PAID BY</Text>
          {payer ? (
            <Card padding={4}>
              <Stack direction="row" gap={3} align="center">
                <Avatar member={payer} size={40} />
                <Text variant="heading">{payer.name}</Text>
              </Stack>
            </Card>
          ) : null}
        </Stack>

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            {SPLIT_LABELS[expense.split.type]?.toUpperCase() ?? 'SPLIT'}
          </Text>
          <Card padding={4}>
            <Stack gap={3}>
              {group.members.map((m) => {
                const owed = shares[m.id] ?? 0;
                if (owed === 0) return null;
                return (
                  <Stack key={m.id} direction="row" justify="space-between" align="center">
                    <Stack direction="row" gap={3} align="center">
                      <Avatar member={m} size={28} />
                      <Text>{m.name}</Text>
                    </Stack>
                    <Text weight="600">{formatINR(owed)}</Text>
                  </Stack>
                );
              })}
            </Stack>
          </Card>
        </Stack>

        <Stack gap={2}>
          <Text variant="caption" tone="muted">COMMENTS</Text>
          {comments.length === 0 ? (
            <Text variant="caption" tone="muted">No comments yet.</Text>
          ) : (
            <Stack gap={2}>
              {comments.map((c) => {
                const mine = c.actor_id === me?.id;
                return (
                  <Card
                    key={c.id}
                    padding={3}
                    style={{
                      backgroundColor: mine ? theme.colors.accentMuted : theme.colors.bgMuted,
                      alignSelf: mine ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}>
                    <Stack gap={1}>
                      <Text variant="caption" tone="muted" weight="700">
                        {memberName(c.actor_id)}
                      </Text>
                      <Text>{String((c.payload as { body?: string })?.body ?? '')}</Text>
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          )}
          <View style={{ marginTop: theme.spacing(2) }}>
            <Stack direction="row" gap={2} align="center">
              <View style={{ flex: 1 }}>
                <Input
                  value={commentBody}
                  onChangeText={setCommentBody}
                  placeholder="Write a comment…"
                />
              </View>
              <Button title="Send" size="sm" disabled={busy || !commentBody.trim()} onPress={submitComment} />
            </Stack>
          </View>
        </Stack>

        <Button
          title="Delete expense"
          variant="danger"
          fullWidth
          onPress={async () => {
            await removeExpense(expense.id);
            nav.goBack();
          }}
        />
      </Stack>
    </Screen>
  );
}
