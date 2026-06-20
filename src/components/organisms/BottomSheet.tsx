import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';
import { IconButton } from '../primitives/IconButton';

export type BottomSheetProps = {
  /** Controlled visibility. */
  open: boolean;
  /** Fired when the sheet is dismissed (backdrop tap, swipe-down, or close). */
  onClose: () => void;
  /** Snap points, e.g. `['50%']`. Omit to size to content. */
  snapPoints?: (string | number)[];
  children: ReactNode;
};

/**
 * A themed bottom sheet built on `@gorhom/bottom-sheet`. Controlled via `open`.
 *
 * Requires a `BottomSheetModalProvider` ancestor (already present in the app
 * root and Storybook preview).
 *
 * Compound API: `BottomSheet.Header` (title + close), `BottomSheet.Content`.
 *
 * @example
 * <BottomSheet open={open} onClose={close} snapPoints={['40%']}>
 *   <BottomSheet.Header onClose={close}>Filters</BottomSheet.Header>
 *   <BottomSheet.Content><Text>…</Text></BottomSheet.Content>
 * </BottomSheet>
 */
function BottomSheetRoot({ open, onClose, snapPoints, children }: BottomSheetProps) {
  const theme = useTheme();
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (open) ref.current?.present();
    else ref.current?.dismiss();
  }, [open]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.45} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.card }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}>
      <BottomSheetView style={{ paddingHorizontal: theme.spacing(5), paddingBottom: theme.spacing(8) }}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

function BottomSheetHeader({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing(3),
      }}>
      <Text variant="heading">{children}</Text>
      {onClose ? <IconButton icon="close" accessibilityLabel="Close" variant="ghost" size="sm" onPress={onClose} /> : null}
    </View>
  );
}

function BottomSheetContent({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return <View style={{ gap: theme.spacing(2) }}>{children}</View>;
}

export const BottomSheet = Object.assign(BottomSheetRoot, {
  Header: BottomSheetHeader,
  Content: BottomSheetContent,
});
