import { Image, Pressable } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Avatar, Button, Card, Screen, Stack, Text } from '../components';
import { useHouseholdStore } from '../features/household/store';
import { useExpensesStore } from '../features/expenses/store';
import { splitExpense } from '../lib/split/splitExpense';
import { formatINR, formatFullDate } from '../lib/format';
import type { RootStackParamList } from '../navigation/types';

type R = RouteProp<RootStackParamList, 'ExpenseDetail'>;

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
  const expense = useExpensesStore((s) => s.expenses.find((e) => e.id === route.params.expenseId));
  const removeExpense = useExpensesStore((s) => s.removeExpense);
  const members = useHouseholdStore((s) => s.members);

  if (!expense) {
    return (
      <Screen padded>
        <Stack gap={4}>
          <Text variant="title">Expense not found</Text>
          <Button title="Close" onPress={() => nav.goBack()} />
        </Stack>
      </Screen>
    );
  }

  const payer = members.find((m) => m.id === expense.payerId);
  const shares = splitExpense(expense);

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="title">Expense</Text>
          <Pressable onPress={() => nav.goBack()}>
            <Text variant="title" tone="muted">
              ×
            </Text>
          </Pressable>
        </Stack>

        <Card padding={5}>
          <Stack gap={2}>
            <Text variant="caption" tone="muted">
              {expense.category.toUpperCase()}
            </Text>
            <Text variant="display">{formatINR(expense.amount)}</Text>
            {expense.description ? <Text variant="body">{expense.description}</Text> : null}
            <Text variant="caption" tone="muted">
              {formatFullDate(expense.paidAt)} · source: {expense.source}
            </Text>
          </Stack>
        </Card>

        {expense.receiptUri ? (
          <Card padding={2}>
            <Image
              source={{ uri: expense.receiptUri }}
              style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: 12 }}
              resizeMode="cover"
            />
          </Card>
        ) : null}

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            PAID BY
          </Text>
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
              {members.map((m) => {
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

        <Button
          title="Delete expense"
          variant="danger"
          fullWidth
          onPress={() => {
            removeExpense(expense.id);
            nav.goBack();
          }}
        />
      </Stack>
    </Screen>
  );
}
