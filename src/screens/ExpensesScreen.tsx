import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Screen, Stack, Text } from '../components';
import { useHouseholdStore } from '../features/household/store';
import { useExpensesStore } from '../features/expenses/store';
import { formatINR, formatShortDate, monthKey, currentMonthKey, formatMonth } from '../lib/format';
import { useTheme } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_EMOJI: Record<string, string> = {
  rent: '🏠',
  utilities: '💡',
  groceries: '🛒',
  household: '🧴',
  food: '🍽',
  other: '✨',
};

export function ExpensesScreen() {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const { members } = useHouseholdStore();
  const expenses = useExpensesStore((s) => s.expenses);

  const months = useMemo(() => {
    const set = new Set<string>([currentMonthKey()]);
    for (const e of expenses) set.add(monthKey(e.paidAt));
    return Array.from(set).sort().reverse();
  }, [expenses]);

  const [filterMonth, setFilterMonth] = useState<string>(currentMonthKey());
  const [filterPayer, setFilterPayer] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => monthKey(e.paidAt) === filterMonth)
      .filter((e) => (filterPayer ? e.payerId === filterPayer : true))
      .sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  }, [expenses, filterMonth, filterPayer]);

  return (
    <Screen scrollable padded>
      <Stack gap={4}>
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="title">Expenses</Text>
          <Button title="+ Add" size="sm" onPress={() => nav.navigate('AddExpense')} />
        </Stack>

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            MONTH
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing(2) }}>
            {months.map((m) => {
              const active = m === filterMonth;
              return (
                <Pressable
                  key={m}
                  onPress={() => setFilterMonth(m)}
                  style={{
                    paddingVertical: theme.spacing(2),
                    paddingHorizontal: theme.spacing(3),
                    borderRadius: theme.radii.pill,
                    backgroundColor: active ? theme.colors.accent : theme.colors.bgMuted,
                  }}>
                  <Text variant="caption" weight="700" tone={active ? 'inverse' : 'default'}>
                    {formatMonth(`${m}-01T00:00:00.000Z`)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Stack>

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            PAID BY
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing(2) }}>
            <Pressable
              onPress={() => setFilterPayer(null)}
              style={{
                paddingVertical: theme.spacing(2),
                paddingHorizontal: theme.spacing(3),
                borderRadius: theme.radii.pill,
                backgroundColor: !filterPayer ? theme.colors.accent : theme.colors.bgMuted,
              }}>
              <Text variant="caption" weight="700" tone={!filterPayer ? 'inverse' : 'default'}>
                Everyone
              </Text>
            </Pressable>
            {members.map((m) => {
              const active = m.id === filterPayer;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setFilterPayer(active ? null : m.id)}
                  style={{
                    paddingVertical: theme.spacing(2),
                    paddingHorizontal: theme.spacing(3),
                    borderRadius: theme.radii.pill,
                    backgroundColor: active ? theme.colors.accent : theme.colors.bgMuted,
                  }}>
                  <Text variant="caption" weight="700" tone={active ? 'inverse' : 'default'}>
                    {m.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Stack>

        {filtered.length === 0 ? (
          <Card padding={5} variant="muted">
            <Text tone="muted">No expenses match these filters.</Text>
          </Card>
        ) : (
          <Stack gap={2}>
            {filtered.map((e) => {
              const payer = members.find((m) => m.id === e.payerId);
              return (
                <Pressable
                  key={e.id}
                  onPress={() => nav.navigate('ExpenseDetail', { expenseId: e.id })}>
                  <Card padding={4}>
                    <Stack direction="row" justify="space-between" align="center">
                      <Stack gap={1} style={{ flex: 1 }}>
                        <Text variant="body" weight="600" numberOfLines={1}>
                          {CATEGORY_EMOJI[e.category] ?? ''} {e.description ?? e.category}
                        </Text>
                        <Stack direction="row" gap={2} align="center">
                          {payer ? <Avatar member={payer} size={20} /> : null}
                          <Text variant="caption" tone="muted">
                            {payer?.name ?? '?'} · {formatShortDate(e.paidAt)} · {e.split.type}
                          </Text>
                        </Stack>
                      </Stack>
                      <Text variant="heading">{formatINR(e.amount)}</Text>
                    </Stack>
                  </Card>
                </Pressable>
              );
            })}
          </Stack>
        )}

        {filtered.length > 0 ? (
          <Card variant="muted" padding={4}>
            <Stack direction="row" justify="space-between" align="center">
              <Text weight="700">Total</Text>
              <Text variant="heading" weight="700">
                {formatINR(filtered.reduce((s, e) => s + e.amount, 0))}
              </Text>
            </Stack>
          </Card>
        ) : null}

        <View style={{ height: theme.spacing(8) }} />
      </Stack>
    </Screen>
  );
}
