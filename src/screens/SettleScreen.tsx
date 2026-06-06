import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Share, View } from 'react-native';
import { Avatar, Button, Card, Screen, Stack, Text } from '../components';
import { useHouseholdStore } from '../features/household/store';
import { useExpensesStore } from '../features/expenses/store';
import { useSettlementsStore } from '../features/settlements/store';
import {
  balancesForMonth,
  expensesInMonth,
  transfersForMonth,
} from '../features/expenses/selectors';
import {
  currentMonthKey,
  formatINR,
  formatMonth,
  monthKey,
  paiseToRupees,
} from '../lib/format';
import { useTheme } from '../theme';

export function SettleScreen() {
  const theme = useTheme();
  const { members, householdName } = useHouseholdStore();
  const expenses = useExpensesStore((s) => s.expenses);
  const settlements = useSettlementsStore((s) => s.settlements);
  const recordSettlement = useSettlementsStore((s) => s.recordSettlement);

  const months = useMemo(() => {
    const set = new Set<string>([currentMonthKey()]);
    for (const e of expenses) set.add(monthKey(e.paidAt));
    for (const s of settlements) set.add(monthKey(s.paidAt));
    return Array.from(set).sort().reverse();
  }, [expenses, settlements]);

  const [activeMonth, setActiveMonth] = useState<string>(currentMonthKey());

  const memberIds = members.map((m) => m.id);
  const balances = useMemo(
    () => balancesForMonth(expenses, settlements, memberIds, activeMonth),
    [expenses, settlements, memberIds, activeMonth],
  );
  const transfers = useMemo(
    () => transfersForMonth(expenses, settlements, memberIds, activeMonth),
    [expenses, settlements, memberIds, activeMonth],
  );
  const monthTotal = useMemo(
    () => expensesInMonth(expenses, activeMonth).reduce((s, e) => s + e.amount, 0),
    [expenses, activeMonth],
  );

  const memberName = (id: string) => members.find((m) => m.id === id)?.name ?? '?';

  const handleUpi = (toId: string, amount: number) => {
    const url = `upi://pay?pa=demo@upi&pn=${encodeURIComponent(memberName(toId))}&am=${paiseToRupees(
      amount,
    ).toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Settle for ${formatMonth(`${activeMonth}-01T00:00:00.000Z`)}`)}`;
    Linking.openURL(url).catch(() => {
      // simulator / no UPI app — silently noop
    });
  };

  const markPaid = (fromId: string, toId: string, amount: number) => {
    recordSettlement({
      householdId: 'h1',
      fromId,
      toId,
      amount,
      paidAt: new Date().toISOString(),
    });
  };

  const shareSummary = async () => {
    const lines: string[] = [];
    lines.push(`🧾 ${householdName} — ${formatMonth(`${activeMonth}-01T00:00:00.000Z`)}`);
    lines.push(`Total spent: ${formatINR(monthTotal)}`);
    lines.push('');
    lines.push('Balances:');
    for (const m of members) {
      const b = balances[m.id] ?? 0;
      const sign = b > 0 ? '+' : '';
      lines.push(`  ${m.name}: ${sign}${formatINR(b)}`);
    }
    if (transfers.length > 0) {
      lines.push('');
      lines.push('Settle up:');
      for (const t of transfers) {
        lines.push(`  ${memberName(t.fromId)} → ${memberName(t.toId)}: ${formatINR(t.amount)}`);
      }
    } else {
      lines.push('');
      lines.push('Everyone is settled. 🎉');
    }
    lines.push('');
    lines.push('Sent from Tiramisu');
    await Share.share({ message: lines.join('\n') });
  };

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Stack direction="row" justify="space-between" align="center">
          <Stack gap={1}>
            <Text variant="caption" tone="muted">
              SETTLE UP
            </Text>
            <Text variant="title">{formatMonth(`${activeMonth}-01T00:00:00.000Z`)}</Text>
          </Stack>
          <Button title="Share" variant="secondary" size="sm" onPress={shareSummary} />
        </Stack>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: theme.spacing(2) }}>
          {months.map((m) => {
            const active = m === activeMonth;
            return (
              <Pressable
                key={m}
                onPress={() => setActiveMonth(m)}
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

        <Card padding={5}>
          <Stack gap={3}>
            <Text variant="caption" tone="muted">
              BALANCES
            </Text>
            {members.map((m) => {
              const b = balances[m.id] ?? 0;
              return (
                <Stack key={m.id} direction="row" justify="space-between" align="center">
                  <Stack direction="row" gap={3} align="center">
                    <Avatar member={m} size={32} />
                    <Text>{m.name}</Text>
                  </Stack>
                  <Text weight="700" tone={b > 0 ? 'success' : b < 0 ? 'danger' : 'muted'}>
                    {b > 0 ? '+' : ''}
                    {formatINR(b)}
                  </Text>
                </Stack>
              );
            })}
          </Stack>
        </Card>

        <Stack gap={2}>
          <Text variant="heading">Suggested transfers</Text>
          {transfers.length === 0 ? (
            <Card padding={5} variant="muted">
              <Text tone="muted">Everyone is even for this month. 🎉</Text>
            </Card>
          ) : (
            <Stack gap={3}>
              {transfers.map((t, i) => (
                <Card key={i} padding={4}>
                  <Stack gap={3}>
                    <Stack direction="row" justify="space-between" align="center">
                      <Stack direction="row" gap={2} align="center" style={{ flex: 1 }}>
                        <Text weight="700">{memberName(t.fromId)}</Text>
                        <Text tone="muted"> owes </Text>
                        <Text weight="700">{memberName(t.toId)}</Text>
                      </Stack>
                      <Text variant="heading">{formatINR(t.amount)}</Text>
                    </Stack>
                    <View style={{ height: 1, backgroundColor: theme.colors.divider }} />
                    <Stack direction="row" gap={2}>
                      <Button
                        title="Pay via UPI →"
                        variant="primary"
                        size="sm"
                        style={{ flex: 1 }}
                        fullWidth
                        onPress={() => handleUpi(t.toId, t.amount)}
                      />
                      <Button
                        title="Mark as paid"
                        variant="secondary"
                        size="sm"
                        style={{ flex: 1 }}
                        fullWidth
                        onPress={() => markPaid(t.fromId, t.toId, t.amount)}
                      />
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Screen>
  );
}
