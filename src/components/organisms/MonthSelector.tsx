import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Modal, Pressable, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Stack } from '../primitives/Stack';
import { Text } from '../primitives/Text';
import { Icon } from '../primitives/Icon';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ITEM_WIDTH = 84;

export type MonthSelectorProps = {
  /** Selected month as `YYYY-MM`. */
  value: string;
  onChange: (value: string) => void;
  /** Years to surface in the picker; current and active years are always included. */
  availableYears?: number[];
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A horizontally snapping month strip with a bottom-sheet year picker. Drives
 * the month-scoped views across the app.
 *
 * @example
 * <MonthSelector value="2026-04" onChange={setMonth} />
 */
export function MonthSelector({ value, onChange, availableYears }: MonthSelectorProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const sidePadding = Math.max(0, (screenWidth - ITEM_WIDTH) / 2);

  const year = Number(value.slice(0, 4));
  const monthIndex = Math.max(0, Math.min(11, Number(value.slice(5, 7)) - 1));

  const [sheetOpen, setSheetOpen] = useState(false);
  const listRef = useRef<FlatList<string>>(null);
  const firstRender = useRef(true);

  const years = useMemo(() => {
    const set = new Set<number>([new Date().getFullYear(), year]);
    for (const y of availableYears ?? []) set.add(y);
    return Array.from(set).sort((a, b) => b - a);
  }, [year, availableYears]);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: monthIndex * ITEM_WIDTH, animated: !firstRender.current });
    firstRender.current = false;
  }, [monthIndex]);

  const setMonth = (i: number) => onChange(`${year}-${pad(i + 1)}`);
  const setYear = (y: number) => onChange(`${y}-${pad(monthIndex + 1)}`);

  return (
    <View style={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(3) }}>
      <Pressable
        onPress={() => setSheetOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Year ${year}, tap to change`}
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          gap: theme.spacing(1),
          alignItems: 'center',
          paddingVertical: theme.spacing(1),
          paddingHorizontal: theme.spacing(3),
          borderRadius: theme.radii.pill,
        }}
        hitSlop={12}>
        <Text variant="caption" tone="muted" weight="700" style={{ letterSpacing: 1.5 }}>
          {year}
        </Text>
        <Icon name="chevron-down" size={14} color="mutedForeground" />
      </Pressable>

      <FlatList
        ref={listRef}
        horizontal
        data={MONTHS}
        keyExtractor={(_, i) => String(i)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        getItemLayout={(_, i) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * i, index: i })}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          if (i !== monthIndex && i >= 0 && i < 12) setMonth(i);
        }}
        renderItem={({ item, index }) => {
          const active = index === monthIndex;
          return (
            <Pressable
              onPress={() => setMonth(index)}
              accessibilityRole="button"
              accessibilityLabel={`${item} ${year}`}
              accessibilityState={{ selected: active }}
              style={{ width: ITEM_WIDTH, height: 56, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  paddingVertical: theme.spacing(1) + 2,
                  paddingHorizontal: theme.spacing(3),
                  borderRadius: theme.radii.pill,
                  backgroundColor: active ? theme.colors.primary : 'transparent',
                }}>
                <Text variant="body" weight={active ? '800' : '500'} tone={active ? 'inverse' : 'muted'}>
                  {item}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />

      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable
          onPress={() => setSheetOpen(false)}
          accessibilityRole="button"
          accessibilityLabel="Close year picker"
          style={{ flex: 1, backgroundColor: theme.colors.overlay }}
        />
        <SafeAreaView
          edges={['bottom']}
          style={{
            backgroundColor: theme.colors.card,
            borderTopLeftRadius: theme.radii.xl,
            borderTopRightRadius: theme.radii.xl,
            paddingHorizontal: theme.spacing(5),
            paddingTop: theme.spacing(3),
          }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.colors.border,
              alignSelf: 'center',
              marginBottom: theme.spacing(4),
            }}
          />
          <Stack gap={3}>
            <Text variant="heading">Pick a year</Text>
            <View style={{ gap: theme.spacing(2) }}>
              {years.map((y) => {
                const active = y === year;
                return (
                  <Pressable
                    key={y}
                    onPress={() => {
                      setYear(y);
                      setSheetOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={{
                      paddingVertical: theme.spacing(3),
                      paddingHorizontal: theme.spacing(4),
                      borderRadius: theme.radii.md,
                      backgroundColor: active ? theme.colors.secondary : theme.colors.muted,
                    }}>
                    <Stack direction="row" justify="space-between" align="center">
                      <Text variant="title" weight={active ? '800' : '500'}>
                        {y}
                      </Text>
                      {active ? <Icon name="check-circle" color="primary" /> : null}
                    </Stack>
                  </Pressable>
                );
              })}
            </View>
          </Stack>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
