import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Avatar,
  Button,
  Card,
  MonthSelector,
  Screen,
  Stack,
  Text,
} from '../components';
import { useGroupsStore } from '../features/groups/store';
import { useExpensesStore } from '../features/expenses/store';
import { useEventsStore } from '../features/events/store';
import { useSettlementsStore } from '../features/settlements/store';
import { useAuthStore } from '../features/auth/store';
import { useSyncController } from '../lib/sync/controller';
import { currentMonthKey, formatINR, formatShortDate } from '../lib/format';
import { useTheme } from '../theme';
import type { EventDto, ExpenseDto, SettlementDto } from '../lib/api';
import type { GroupStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<GroupStackParamList>;

const CATEGORY_EMOJI: Record<string, string> = {
  rent: '🏠',
  utilities: '💡',
  groceries: '🛒',
  household: '🧴',
  food: '🍽',
  other: '✨',
};

export function MonthRoomScreen() {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const { groups, activeGroupId } = useGroupsStore();
  const group = groups.find(g => g.id === activeGroupId);
  const me = useAuthStore(s => s.user);

  const [month, setMonth] = useState<string>(currentMonthKey());

  useSyncController({ groupId: activeGroupId, month });

  const expenses = useExpensesStore(s => s.expenses);
  const settlements = useSettlementsStore(s => s.settlements);
  const events = useEventsStore(s => s.events);
  const refreshExpenses = useExpensesStore(s => s.refresh);
  const refreshSettlements = useSettlementsStore(s => s.refresh);
  const refreshEvents = useEventsStore(s => s.refresh);
  const loading = useEventsStore(s => s.loading);

  const expensesById = useMemo(
    () => new Map<string, ExpenseDto>(expenses.map(e => [e.id, e])),
    [expenses],
  );
  const settlementsById = useMemo(
    () => new Map<string, SettlementDto>(settlements.map(s => [s.id, s])),
    [settlements],
  );

  const years = useMemo(() => {
    const set = new Set<number>([new Date().getFullYear(), Number(month.slice(0, 4))]);
    for (const e of expenses) set.add(Number(e.paid_at.slice(0, 4)));
    for (const s of settlements) set.add(Number(s.paid_at.slice(0, 4)));
    return Array.from(set).sort((a, b) => b - a);
  }, [expenses, settlements, month]);

  const visible = useMemo(
    () => [...events].sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [events],
  );

  const refreshAll = () => {
    refreshExpenses();
    refreshSettlements();
    refreshEvents();
  };

  if (!group) {
    return (
      <Screen padded>
        <Text variant="title">No active group</Text>
      </Screen>
    );
  }

  const memberName = (id: string) =>
    group.members.find(m => m.id === id)?.name ?? '?';
  const memberFor = (id: string) => group.members.find(m => m.id === id);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <Header
        groupName={group.name}
        icon={group.icon ?? '🏠'}
        onProfile={() => useAuthStore.getState().signOut()}
      />

      <MonthSelector value={month} onChange={setMonth} availableYears={years} />

      <FlatList
        data={visible}
        keyExtractor={e => e.id}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing(5),
          paddingTop: theme.spacing(3),
          paddingBottom: theme.spacing(6),
          gap: theme.spacing(3),
        }}
        ListEmptyComponent={
          <Card padding={5} variant="muted">
            <Stack gap={2}>
              <Text variant="heading">Quiet so far.</Text>
              <Text variant="body" tone="muted">
                Add the first expense to get this month going.
              </Text>
            </Stack>
          </Card>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshAll}
            tintColor={theme.colors.accent}
          />
        }
        renderItem={({ item }) => (
          <EventCell
            event={item}
            expense={
              item.subject_id ? expensesById.get(item.subject_id) : undefined
            }
            settlement={
              item.subject_id ? settlementsById.get(item.subject_id) : undefined
            }
            mine={item.actor_id === me?.id}
            actorName={memberName(item.actor_id)}
            actor={memberFor(item.actor_id)}
            onPressExpense={eid =>
              nav.navigate('ExpenseDetail', { expenseId: eid })
            }
          />
        )}
      />

      <View
        style={{
          backgroundColor: theme.colors.bgElevated,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingHorizontal: theme.spacing(5),
          paddingTop: theme.spacing(3),
          paddingBottom: theme.spacing(4),
        }}
      >
        <Button
          title="+ Add expense"
          fullWidth
          onPress={() => nav.navigate('AddExpense', {})}
        />
      </View>
    </View>
  );

  function EventCell({
    event,
    expense,
    settlement,
    mine,
    actorName,
    actor,
    onPressExpense,
  }: {
    event: EventDto;
    expense?: ExpenseDto;
    settlement?: SettlementDto;
    mine: boolean;
    actorName: string;
    actor: { id: string; name: string; avatar: string | null } | undefined;
    onPressExpense: (eid: string) => void;
  }) {
    const time = formatShortDate(event.created_at);

    if (event.kind === 'expense_added' && expense) {
      return (
        <Pressable onPress={() => onPressExpense(expense.id)}>
          <Stack direction="row" gap={2} align="flex-start">
            {actor ? (
              <Avatar member={actor} size={32} />
            ) : (
              <View style={{ width: 32 }} />
            )}
            <Card padding={4} style={{ flex: 1 }}>
              <Stack gap={2}>
                <Stack direction="row" justify="space-between" align="center">
                  <Text variant="caption" tone="muted" weight="700">
                    {actorName.toUpperCase()} · {time}
                  </Text>
                </Stack>
                <Stack direction="row" justify="space-between" align="center">
                  <Stack gap={1} style={{ flex: 1 }}>
                    <Text variant="heading">
                      {CATEGORY_EMOJI[expense.category] ?? ''}{' '}
                      {expense.description ?? expense.category}
                    </Text>
                    <Text variant="caption" tone="muted">
                      {expense.split.type} split · {expense.source}
                    </Text>
                  </Stack>
                  <Text variant="title">{formatINR(expense.amount)}</Text>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Pressable>
      );
    }

    if (event.kind === 'settlement_recorded' && settlement) {
      return (
        <Stack direction="row" gap={2} align="flex-start">
          {actor ? (
            <Avatar member={actor} size={32} />
          ) : (
            <View style={{ width: 32 }} />
          )}
          <Card padding={4} variant="muted" style={{ flex: 1 }}>
            <Stack gap={1}>
              <Text variant="caption" tone="muted" weight="700">
                SETTLEMENT · {time}
              </Text>
              <Text>
                <Text weight="700">{memberName(settlement.from_id)}</Text> paid{' '}
                <Text weight="700">{memberName(settlement.to_id)}</Text>{' '}
                <Text weight="700" tone="success">
                  {formatINR(settlement.amount)}
                </Text>
              </Text>
            </Stack>
          </Card>
        </Stack>
      );
    }

    if (event.kind === 'comment') {
      const body = String((event.payload as { body?: string })?.body ?? '');
      const onExpense = event.subject_id
        ? expensesById.get(event.subject_id)
        : undefined;
      return (
        <Pressable onPress={() => onExpense && onPressExpense(onExpense.id)}>
          <Stack
            direction="row"
            gap={2}
            align="flex-start"
            style={{ justifyContent: mine ? 'flex-end' : 'flex-start' }}
          >
            {!mine && actor ? <Avatar member={actor} size={28} /> : null}
            <Card
              padding={3}
              style={{
                maxWidth: '78%',
                backgroundColor: mine
                  ? theme.colors.accentMuted
                  : theme.colors.bgElevated,
              }}
            >
              <Stack gap={1}>
                <Text variant="caption" tone="muted">
                  {actorName} · {time}
                </Text>
                {onExpense ? (
                  <Text variant="caption" tone="muted">
                    ↳ on {onExpense.description ?? onExpense.category}
                  </Text>
                ) : null}
                <Text>{body}</Text>
              </Stack>
            </Card>
            {mine && actor ? <Avatar member={actor} size={28} /> : null}
          </Stack>
        </Pressable>
      );
    }

    // Fallback: system-style pill for member_joined, expense_updated, expense_deleted, etc.
    return (
      <Stack align="center">
        <Text variant="caption" tone="muted">
          {actorName} · {prettifyKind(event.kind)} · {time}
        </Text>
      </Stack>
    );
  }
}

function prettifyKind(kind: string): string {
  switch (kind) {
    case 'expense_updated':
      return 'edited an expense';
    case 'expense_deleted':
      return 'removed an expense';
    case 'settlement_deleted':
      return 'undid a settlement';
    case 'member_joined':
      return 'joined';
    case 'month_closed':
      return 'closed the month';
    default:
      return kind;
  }
}

function Header({
  groupName,
  icon,
  onProfile,
}: {
  groupName: string;
  icon: string;
  onProfile: () => void;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingTop: 56,
        paddingBottom: theme.spacing(3),
        paddingHorizontal: theme.spacing(5),
        backgroundColor: theme.colors.bgElevated,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row" gap={2} align="center">
        <Text style={{ fontSize: 24 }}>{icon}</Text>
        <Stack gap={0}>
          <Text variant="heading">{groupName}</Text>
          <Text variant="caption" tone="muted">
            Tap a card for details
          </Text>
        </Stack>
      </Stack>
      <Pressable onPress={onProfile}>
        <Text variant="caption" tone="muted">
          Sign out
        </Text>
      </Pressable>
    </View>
  );
}
