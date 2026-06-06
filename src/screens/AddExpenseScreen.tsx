import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Avatar, Button, Card, Input, Screen, SegmentedControl, Stack, Text } from '../components';
import { useHouseholdStore } from '../features/household/store';
import { useExpensesStore } from '../features/expenses/store';
import { useSmsStore } from '../features/sms/store';
import { useTheme } from '../theme';
import { formatINR, parseRupeesInput } from '../lib/format';
import { uid } from '../lib/storage/uid';
import { validateSplit, type ExpenseCategory, type SplitRule } from '../lib/split';
import type { RootStackParamList } from '../navigation/types';

type Mode = 'equal' | 'shares' | 'percent' | 'exact' | 'itemized';

const MODE_OPTIONS: ReadonlyArray<{ value: Mode; label: string }> = [
  { value: 'equal', label: 'Equal' },
  { value: 'shares', label: 'Shares' },
  { value: 'percent', label: '%' },
  { value: 'exact', label: 'Exact' },
  { value: 'itemized', label: 'Items' },
];

const CATEGORIES: ReadonlyArray<{ value: ExpenseCategory; label: string; emoji: string }> = [
  { value: 'rent', label: 'Rent', emoji: '🏠' },
  { value: 'utilities', label: 'Utilities', emoji: '💡' },
  { value: 'groceries', label: 'Groceries', emoji: '🛒' },
  { value: 'household', label: 'Household', emoji: '🧴' },
  { value: 'food', label: 'Food', emoji: '🍽' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

export function AddExpenseScreen() {
  const nav = useNavigation();
  const theme = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'AddExpense'>>();
  const prefill = route.params?.prefill;

  const { members, currentUserId } = useHouseholdStore();
  const addExpense = useExpensesStore((s) => s.addExpense);
  const dismissHint = useSmsStore((s) => s.dismiss);

  const [payerId, setPayerId] = useState<string>(prefill?.payerId ?? currentUserId ?? members[0]?.id ?? '');
  const [amountStr, setAmountStr] = useState<string>(
    prefill?.amount != null ? (prefill.amount / 100).toString() : '',
  );
  const [description, setDescription] = useState(prefill?.description ?? '');
  const [category, setCategory] = useState<ExpenseCategory>((prefill?.category as ExpenseCategory) ?? 'groceries');
  const [recurring, setRecurring] = useState(false);
  const [mode, setMode] = useState<Mode>('equal');
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const initialFair = useMemo(() => {
    const out: Record<string, string> = {};
    for (const m of members) out[m.id] = '';
    return out;
  }, [members]);

  const [shares, setShares] = useState<Record<string, string>>(initialFair);
  const [percents, setPercents] = useState<Record<string, string>>(initialFair);
  const [exact, setExact] = useState<Record<string, string>>(initialFair);
  const [items, setItems] = useState<
    Array<{ id: string; description: string; amount: string; participantIds: string[] }>
  >([]);

  const amountPaise = parseRupeesInput(amountStr) ?? 0;

  const splitRule: SplitRule = useMemo(() => {
    if (mode === 'equal') {
      return {
        type: 'equal',
        participantIds: members.filter((m) => !excluded.has(m.id)).map((m) => m.id),
      };
    }
    if (mode === 'shares') {
      const result: Record<string, number> = {};
      for (const [id, v] of Object.entries(shares)) {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 0) result[id] = n;
      }
      return { type: 'shares', shares: result };
    }
    if (mode === 'percent') {
      const result: Record<string, number> = {};
      for (const [id, v] of Object.entries(percents)) {
        const n = Number(v);
        if (!Number.isNaN(n)) result[id] = n;
      }
      return { type: 'percent', percents: result };
    }
    if (mode === 'exact') {
      const result: Record<string, number> = {};
      for (const [id, v] of Object.entries(exact)) {
        const paise = parseRupeesInput(v);
        if (paise != null) result[id] = paise;
      }
      return { type: 'exact', amounts: result };
    }
    return {
      type: 'itemized',
      items: items.map((it) => ({
        id: it.id,
        description: it.description,
        amount: parseRupeesInput(it.amount) ?? 0,
        split: { type: 'equal', participantIds: it.participantIds },
      })),
    };
  }, [mode, members, excluded, shares, percents, exact, items]);

  const validation = useMemo(() => validateSplit(amountPaise, splitRule), [amountPaise, splitRule]);

  const toggleExcluded = (id: string) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const setMap = (
    setter: (fn: (prev: Record<string, string>) => Record<string, string>) => void,
    id: string,
    v: string,
  ) => setter((prev) => ({ ...prev, [id]: v }));

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        id: uid('it'),
        description: '',
        amount: '',
        participantIds: members.map((m) => m.id),
      },
    ]);

  const updateItem = (
    id: string,
    patch: Partial<{ description: string; amount: string; participantIds: string[] }>,
  ) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const canSave = validation.ok && amountPaise > 0 && payerId.length > 0;

  const save = () => {
    if (!canSave) return;
    addExpense({
      householdId: 'h1',
      amount: amountPaise,
      currency: 'INR',
      payerId,
      paidAt: new Date().toISOString(),
      category,
      description: description.trim() || undefined,
      receiptUri: prefill?.receiptUri,
      source: prefill?.source ?? 'manual',
      recurring: recurring
        ? { cadence: 'monthly', nextDueIso: nextMonthISO() }
        : undefined,
      split: splitRule,
      createdBy: currentUserId ?? payerId,
    });
    if (prefill?.fromHint) dismissHint(prefill.fromHint.id);
    nav.goBack();
  };

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="title">New expense</Text>
          <Pressable onPress={() => nav.goBack()}>
            <Text variant="title" tone="muted">
              ×
            </Text>
          </Pressable>
        </Stack>

        <Card padding={5}>
          <Stack gap={3}>
            <Input
              label="Amount (₹)"
              value={amountStr}
              onChangeText={setAmountStr}
              placeholder="0"
              keyboardType="decimal-pad"
              prefix="₹"
            />
            <Input
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. groceries from Nature Basket"
            />
          </Stack>
        </Card>

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            CATEGORY
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2) }}>
            {CATEGORIES.map((c) => {
              const active = c.value === category;
              return (
                <Pressable
                  key={c.value}
                  onPress={() => setCategory(c.value)}
                  style={{
                    paddingVertical: theme.spacing(2),
                    paddingHorizontal: theme.spacing(3),
                    borderRadius: theme.radii.pill,
                    backgroundColor: active ? theme.colors.accent : theme.colors.bgMuted,
                  }}>
                  <Text
                    variant="caption"
                    weight="600"
                    tone={active ? 'inverse' : 'default'}>
                    {c.emoji} {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Stack>

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            PAID BY
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing(2) }}>
            {members.map((m) => {
              const active = m.id === payerId;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setPayerId(m.id)}
                  style={{
                    alignItems: 'center',
                    gap: theme.spacing(1),
                    padding: theme.spacing(1),
                  }}>
                  <Avatar member={m} size={48} ring={active} />
                  <Text variant="caption" tone={active ? 'accent' : 'muted'} weight={active ? '700' : '500'}>
                    {m.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Stack>

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            SPLIT
          </Text>
          <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
        </Stack>

        {mode === 'equal' ? (
          <Card padding={4}>
            <Stack gap={3}>
              <Text variant="caption" tone="muted">
                Tap a flatmate to exclude them from this expense.
              </Text>
              {members.map((m) => {
                const isOut = excluded.has(m.id);
                return (
                  <Pressable key={m.id} onPress={() => toggleExcluded(m.id)}>
                    <Stack direction="row" justify="space-between" align="center">
                      <Stack direction="row" gap={3} align="center">
                        <Avatar member={m} size={32} />
                        <Text style={{ textDecorationLine: isOut ? 'line-through' : 'none' }}>
                          {m.name}
                        </Text>
                      </Stack>
                      <Text variant="caption" tone={isOut ? 'muted' : 'accent'}>
                        {isOut ? 'excluded' : 'included'}
                      </Text>
                    </Stack>
                  </Pressable>
                );
              })}
            </Stack>
          </Card>
        ) : null}

        {mode === 'shares' ? (
          <Card padding={4}>
            <Stack gap={3}>
              {members.map((m) => (
                <Stack key={m.id} direction="row" gap={3} align="center">
                  <Avatar member={m} size={32} />
                  <Text style={{ flex: 1 }}>{m.name}</Text>
                  <View style={{ width: 90 }}>
                    <Input
                      value={shares[m.id] ?? ''}
                      onChangeText={(v) => setMap(setShares, m.id, v)}
                      placeholder="0"
                      keyboardType="number-pad"
                    />
                  </View>
                </Stack>
              ))}
            </Stack>
          </Card>
        ) : null}

        {mode === 'percent' ? (
          <Card padding={4}>
            <Stack gap={3}>
              {members.map((m) => (
                <Stack key={m.id} direction="row" gap={3} align="center">
                  <Avatar member={m} size={32} />
                  <Text style={{ flex: 1 }}>{m.name}</Text>
                  <View style={{ width: 90 }}>
                    <Input
                      value={percents[m.id] ?? ''}
                      onChangeText={(v) => setMap(setPercents, m.id, v)}
                      placeholder="0"
                      keyboardType="decimal-pad"
                      prefix="%"
                    />
                  </View>
                </Stack>
              ))}
            </Stack>
          </Card>
        ) : null}

        {mode === 'exact' ? (
          <Card padding={4}>
            <Stack gap={3}>
              {members.map((m) => (
                <Stack key={m.id} direction="row" gap={3} align="center">
                  <Avatar member={m} size={32} />
                  <Text style={{ flex: 1 }}>{m.name}</Text>
                  <View style={{ width: 110 }}>
                    <Input
                      value={exact[m.id] ?? ''}
                      onChangeText={(v) => setMap(setExact, m.id, v)}
                      placeholder="0"
                      keyboardType="decimal-pad"
                      prefix="₹"
                    />
                  </View>
                </Stack>
              ))}
            </Stack>
          </Card>
        ) : null}

        {mode === 'itemized' ? (
          <Stack gap={3}>
            {items.map((it) => (
              <Card key={it.id} padding={4}>
                <Stack gap={3}>
                  <Stack direction="row" gap={2}>
                    <View style={{ flex: 1 }}>
                      <Input
                        value={it.description}
                        onChangeText={(v) => updateItem(it.id, { description: v })}
                        placeholder="Item description"
                      />
                    </View>
                    <View style={{ width: 110 }}>
                      <Input
                        value={it.amount}
                        onChangeText={(v) => updateItem(it.id, { amount: v })}
                        placeholder="₹"
                        keyboardType="decimal-pad"
                        prefix="₹"
                      />
                    </View>
                  </Stack>
                  <Text variant="caption" tone="muted">
                    Split equally between:
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2) }}>
                    {members.map((m) => {
                      const active = it.participantIds.includes(m.id);
                      return (
                        <Pressable
                          key={m.id}
                          onPress={() =>
                            updateItem(it.id, {
                              participantIds: active
                                ? it.participantIds.filter((id) => id !== m.id)
                                : [...it.participantIds, m.id],
                            })
                          }
                          style={{
                            paddingVertical: theme.spacing(1),
                            paddingHorizontal: theme.spacing(2),
                            borderRadius: theme.radii.pill,
                            backgroundColor: active ? theme.colors.accentMuted : theme.colors.bgMuted,
                          }}>
                          <Text variant="caption">{m.name}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Pressable onPress={() => removeItem(it.id)}>
                    <Text variant="caption" tone="danger">
                      Remove item
                    </Text>
                  </Pressable>
                </Stack>
              </Card>
            ))}
            <Button title="+ Add item" variant="ghost" onPress={addItem} />
          </Stack>
        ) : null}

        <Pressable onPress={() => setRecurring((r) => !r)}>
          <Card padding={4}>
            <Stack direction="row" justify="space-between" align="center">
              <Stack gap={1} style={{ flex: 1 }}>
                <Text weight="600">Recurring monthly</Text>
                <Text variant="caption" tone="muted">
                  Auto-suggest this expense on the 1st of next month.
                </Text>
              </Stack>
              <Text variant="heading" tone={recurring ? 'accent' : 'muted'}>
                {recurring ? '●' : '○'}
              </Text>
            </Stack>
          </Card>
        </Pressable>

        {!validation.ok && amountPaise > 0 ? (
          <Card variant="outlined" padding={4} style={{ borderColor: theme.colors.danger }}>
            <Text tone="danger" variant="caption">
              {validation.reason}
            </Text>
          </Card>
        ) : null}

        <Stack gap={2}>
          <Text variant="caption" tone="muted">
            {amountPaise > 0 ? `Total: ${formatINR(amountPaise)}` : 'Enter an amount to continue'}
          </Text>
          <Button title="Save expense" fullWidth disabled={!canSave} onPress={save} />
        </Stack>
      </Stack>
    </Screen>
  );
}

const nextMonthISO = (): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(1);
  return d.toISOString();
};
