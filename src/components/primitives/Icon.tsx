import {
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Search,
  Settings,
  User,
  Users,
  Bell,
  Camera,
  ScanLine,
  Wallet,
  Receipt,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Info,
  TriangleAlert,
  CircleAlert,
  CircleCheck,
  CircleX,
  Trash2,
  Pencil,
  MoreHorizontal,
  House,
  Split,
  Share2,
  Timer,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../theme';
import type { ThemeColors } from '../../theme';

/**
 * Curated icon registry. The design system uses a fixed, named set rather than
 * exposing all ~1,500 Lucide icons — this keeps usage discoverable and the
 * bundle small. Add an icon here (and only here) when a new one is needed.
 */
export const iconRegistry = {
  plus: Plus,
  minus: Minus,
  check: Check,
  close: X,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  search: Search,
  settings: Settings,
  user: User,
  users: Users,
  bell: Bell,
  camera: Camera,
  scan: ScanLine,
  wallet: Wallet,
  receipt: Receipt,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  calendar: Calendar,
  info: Info,
  warning: TriangleAlert,
  'alert-circle': CircleAlert,
  'check-circle': CircleCheck,
  'x-circle': CircleX,
  trash: Trash2,
  edit: Pencil,
  'more-horizontal': MoreHorizontal,
  home: House,
  split: Split,
  share: Share2,
  timer: Timer,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export type IconProps = {
  /** Icon to render — one of the registered names. */
  name: IconName;
  /** Pixel size (width === height). */
  size?: number;
  /**
   * Color: a `theme.colors` token name (e.g. `'primary'`, `'mutedForeground'`)
   * or any raw color string. Defaults to the current `foreground`.
   */
  color?: keyof ThemeColors | (string & {});
  /** Stroke thickness. */
  strokeWidth?: number;
};

/**
 * Renders a themed Lucide icon.
 *
 * @example
 * <Icon name="chevron-down" />
 * <Icon name="check-circle" color="successForeground" size={24} />
 */
export function Icon({ name, size = 20, color, strokeWidth = 2 }: IconProps) {
  const theme = useTheme();
  const LucideGlyph = iconRegistry[name];
  const resolved =
    color && color in theme.colors ? theme.colors[color as keyof ThemeColors] : (color as string | undefined);
  return <LucideGlyph size={size} color={resolved ?? theme.colors.foreground} strokeWidth={strokeWidth} />;
}
