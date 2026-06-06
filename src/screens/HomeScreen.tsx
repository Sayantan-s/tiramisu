import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Screen, Stack, Text } from '../components';
import { useHouseholdStore } from '../features/household/store';
import { useExpensesStore } from '../features/expenses/store';
import { useSettlementsStore } from '../features/settlements/store';
import { computeActiveHints, useSmsStore } from '../features/sms/store';
import {
  balancesForMonth,
  expensesInMonth,
  topCategories,
  totalSpent,
} from '../features/expenses/selectors';
import { formatINR, formatINRCompact, currentMonthKey, formatMonth } from '../lib/format';
import { useTheme } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_LABELS: Record<string, string> = {
  rent: 'Rent',
  utilities: 'Utilities',
  groceries: 'Groceries',
  household: 'Household',
  food: 'Food & Dining',
  other: 'Other',
};

export function HomeScreen() {
  const theme = useTheme();
  const nav = useNavigation<Nav>();

  const members = useHouseholdStore((s) => s.members);
  const currentUserId = useHouseholdStore((s) => s.currentUserId);
  const householdName = useHouseholdStore((s) => s.householdName);
  const me = members.find((m) => m.id === currentUserId);
  const expenses = useExpensesStore((s) => s.expenses);
  const settlements = useSettlementsStore((s) => s.settlements);
  const rawHints = useSmsStore((s) => s.hints);
  const dismissedIds = useSmsStore((s) => s.dismissedIds);
  const hints = useMemo(() => computeActiveHints(rawHints, dismissedIds), [rawHints, dismissedIds]);
  const dismissHint = useSmsStore((s) => s.dismiss);
  const initSms = useSmsStore((s) => s.initFromSeed);

  useEffect(() => {
    initSms();
  }, [initSms]);

  const month = currentMonthKey();
  const monthExpenses = useMemo(() => expensesInMonth(expenses, month), [expenses, month]);
  const total = useMemo(() => totalSpent(monthExpenses), [monthExpenses]);
  const balances = useMemo(
    () => balancesForMonth(expenses, settlements, members.map((m) => m.id), month),
    [expenses, settlements, members, month],
  );
  const myBalance = currentUserId ? balances[currentUserId] ?? 0 : 0;
  const top = useMemo(() => topCategories(monthExpenses, 3), [monthExpenses]);

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Stack direction="row" justify="space-between" align="center">
          <Stack gap={1}>
            <Text variant="caption" tone="muted">
              {householdName.toUpperCase()}
            </Text>
            <Text variant="title">{formatMonth(new Date().toISOString())}</Text>
          </Stack>
          <Pressable onPress={() => nav.navigate('ProfileSwitcher')}>
            {me ? <Avatar member={me} size={44} ring /> : null}
          </Pressable>
        </Stack>

        <Card padding={5}>
          <Stack gap={2}>
            <Text variant="caption" tone="muted">
              YOU'RE
            </Text>
            <Text variant="display" tone={myBalance >= 0 ? 'success' : 'danger'}>
              {myBalance >= 0 ? '+' : ''}
              {formatINR(myBalance)}
            </Text>
            <Text variant="body" tone="muted">
              {myBalance > 0
                ? `${members.length - 1} flatmates owe you this month`
                : myBalance < 0
                  ? 'you owe the house this month'
                  : 'all settled up this month'}
            </Text>
          </Stack>
        </Card>

        <Stack direction="row" gap={3}>
          <Button
            title="+ Add expense"
            onPress={() => nav.navigate('AddExpense')}
            style={{ flex: 1 }}
            fullWidth
          />
          <Button
            title="Settle up"
            variant="secondary"
            onPress={() => nav.navigate('Main', { screen: 'Settle' })}
            style={{ flex: 1 }}
            fullWidth
          />
        </Stack>

        {hints.length > 0 ? (
          <Stack gap={2}>
            <Text variant="heading">Anything missed?</Text>
            <Text variant="caption" tone="muted">
              Payments we noticed — tap to log as shared.
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: theme.spacing(3), paddingRight: theme.spacing(2) }}>
              {hints.slice(0, 6).map((h) => (
                <Card
                  key={h.id}
                  variant="outlined"
                  padding={4}
                  style={{ width: 240, borderColor: theme.colors.border }}>
                  <Stack gap={2}>
                    <Stack direction="row" justify="space-between" align="center">
                      <Text variant="caption" tone="accent" weight="700">
                        {h.sender}
                      </Text>
                      <Pressable onPress={() => dismissHint(h.id)}>
                        <Text variant="caption" tone="muted">
                          dismiss
                        </Text>
                      </Pressable>
                    </Stack>
                    <Text variant="heading">{formatINR(h.amount)}</Text>
                    <Text variant="body" tone="muted" numberOfLines={1}>
                      to {h.counterparty}
                    </Text>
                    <Button
                      title="Log as shared →"
                      variant="ghost"
                      size="sm"
                      onPress={() =>
                        nav.navigate('AddExpense', {
                          prefill: {
                            amount: h.amount,
                            description: h.counterparty,
                            source: 'sms',
                            fromHint: h,
                          },
                        })
                      }
                    />
                  </Stack>
                </Card>
              ))}
            </ScrollView>
          </Stack>
        ) : null}

        <Stack gap={2}>
          <Stack direction="row" justify="space-between" align="center">
            <Text variant="heading">This month</Text>
            <Text variant="caption" tone="muted">
              {formatINRCompact(total)} total
            </Text>
          </Stack>
          {top.length === 0 ? (
            <Card padding={5} variant="muted">
              <Text tone="muted">No expenses yet — add one to get started.</Text>
            </Card>
          ) : (
            <Card padding={4}>
              <Stack gap={3}>
                {top.map((row) => {
                  const pct = total > 0 ? row.amount / total : 0;
                  return (
                    <Stack key={row.category} gap={1}>
                      <Stack direction="row" justify="space-between">
                        <Text variant="body" weight="600">
                          {CATEGORY_LABELS[row.category] ?? row.category}
                        </Text>
                        <Text variant="body" tone="muted">
                          {formatINR(row.amount)}
                        </Text>
                      </Stack>
                      <View
                        style={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.colors.bgMuted,
                          overflow: 'hidden',
                        }}>
                        <View
                          style={{
                            width: `${Math.max(pct * 100, 4)}%`,
                            height: '100%',
                            backgroundColor: theme.colors.accent,
                          }}
                        />
                      </View>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>
          )}
        </Stack>

        <Stack gap={2}>
          <Text variant="heading">Recent</Text>
          {monthExpenses
            .slice()
            .sort((a, b) => b.paidAt.localeCompare(a.paidAt))
            .slice(0, 5)
            .map((e) => {
              const payer = members.find((m) => m.id === e.payerId);
              return (
                <Pressable
                  key={e.id}
                  onPress={() => nav.navigate('ExpenseDetail', { expenseId: e.id })}>
                  <Card padding={4}>
                    <Stack direction="row" justify="space-between" align="center">
                      <Stack gap={1} style={{ flex: 1 }}>
                        <Text variant="body" weight="600">
                          {e.description ?? CATEGORY_LABELS[e.category] ?? e.category}
                        </Text>
                        <Text variant="caption" tone="muted">
                          {payer?.name ?? '?'} paid
                        </Text>
                      </Stack>
                      <Text variant="heading">{formatINR(e.amount)}</Text>
                    </Stack>
                  </Card>
                </Pressable>
              );
            })}
        </Stack>
      </Stack>
    </Screen>
  );
}
