import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useExpensesStore } from '../../features/expenses/store';
import { useSettlementsStore } from '../../features/settlements/store';
import { useEventsStore } from '../../features/events/store';

const POLL_MS = 30_000;

export function useSyncController({
  groupId,
  month,
}: {
  groupId: string | null;
  month: string | null;
}): void {
  useEffect(() => {
    if (!groupId) return;

    useExpensesStore.getState().setGroup(groupId);
    useSettlementsStore.getState().setGroup(groupId);
    useEventsStore.getState().setContext(groupId, month);

    const refreshAll = () => {
      useExpensesStore.getState().refresh();
      useSettlementsStore.getState().refresh();
      useEventsStore.getState().refresh();
    };

    refreshAll();

    const interval = setInterval(refreshAll, POLL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshAll();
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [groupId, month]);
}
