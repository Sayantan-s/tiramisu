---
name: tiramisu-design-system
description: >-
  Methodology for adding or modifying components in the Tiramisu React Native
  design system (src/components). Use this whenever the task involves building,
  changing, or reviewing a UI component, primitive, or compound component in this
  app — e.g. "add a Tooltip", "make a stepper", "build a toast", "create a new
  form control", "add a card variant", "we need a date picker component" — even
  when the user doesn't say "design system". It covers how to classify a piece of
  UI as a primitive/molecule/organism, the file + token + styling conventions,
  the compound-component pattern, and how to add stories that double as tests.
---

# Building Tiramisu design system components

This skill captures how the Tiramisu component library is built so new components
match the existing ones. The library lives in `src/components`, themed from
`src/theme/theme.ts`. Read `src/components/README.md` once for the big picture.

The goal of every component is the same: **token-driven, themeable, self-documenting,
and demonstrated by a story that also serves as a test.** When in doubt, open the
closest existing component and mirror it — consistency beats cleverness here.

## Step 1 — Classify the component

Pick the tier first; it decides the folder, the API shape, and how much it composes.

```
Is it a single, indivisible UI element with one job and no internal sections?
  → PRIMITIVE (atom)            src/components/primitives/
    e.g. Text, Button, Icon, Avatar, Badge, Chip, Input, Switch, Progress, Divider

Does it group a few elements that belong together, with named parts a caller
arranges (header/body, label/control/error, leading/content/trailing)?
  → MOLECULE                    src/components/molecules/
    e.g. Card.*, FormField.*, ListItem.*, Alert.*, SegmentedControl, AvatarGroup

Is it interactive/stateful, coordinates several parts, or owns overlay/animation
(open-close, expand, tab switching, sheets)?
  → ORGANISM                    src/components/organisms/
    e.g. Accordion.*, Tabs.*, BottomSheet.*, Select, MonthSelector

Is it a full page/screen scaffold that arranges organisms into a layout?
  → TEMPLATE/SCREEN             src/screens/ (use the Screen primitive as the shell)
```

Two quick heuristics:

- **If parts are arranged by the caller, it's compound** (molecule/organism). If
  the component renders one fixed thing, it's a primitive.
- **If it owns state, animation, or a portal/overlay, it's an organism**, even if
  it looks small (e.g. `Select` is tiny but opens a sheet).

When it's genuinely ambiguous, prefer the lower tier and let a higher-tier
component compose it later. Don't invent a "template" for something that's really
a molecule.

## Step 2 — Honor the conventions (non-negotiable for consistency)

Every component in this repo follows these. They're what make the library feel
like one system rather than 30 individual files.

- **Named `function` component**, not `React.FC`, not an arrow const.
- **Props extend the underlying RN element** and `Omit` what you override:
  `export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {…}`.
- **All styling comes from `useTheme()`, written inline.** No `StyleSheet.create`,
  no hard-coded colors / radii / font sizes / spacing. Colors → `theme.colors.*`,
  radii → `theme.radii.*`, spacing → `theme.spacing(n)` (n × 4px), type →
  `theme.typography.*` (via the `Text` primitive's `variant`).
- **Accept a `style` prop and merge it last** so callers can override:
  `style={[{ …computed }, style]}`.
- **Use semantic tokens, never the deprecated aliases** in new code: `primary` not
  `accent`, `destructive` not `danger`, `background`/`foreground`/`card`/`muted`,
  `mutedForeground`, `border`, `input`, `ring`. (Aliases exist only so old screens
  keep compiling.)
- **Compose, don't re-implement.** Build on `Text`, `Icon`, `Pressable`, `Box`,
  `Stack` rather than re-styling raw `View`/`Text`.
- **Accessibility is part of the component**, not an afterthought: set
  `accessibilityRole`, `accessibilityState` ({ checked, selected, disabled,
  expanded, busy }), and require an `accessibilityLabel` for icon-only controls.
- **Self-documenting**: explicit prop types with JSDoc, a JSDoc block on the
  component with an `@example`, no abbreviations. The types are the docs.

Reference primitives to copy from: `src/components/primitives/Button.tsx`
(variants/sizes/loading/icons), `Badge.tsx` (token-resolution helper),
`Input.tsx` (focus ring + label/error), `Switch.tsx` (RN `Animated`, no extra deps).

## Step 3 — For molecules/organisms, use the compound pattern

Molecules and organisms expose their parts as static properties and share state
through **React context**, so callers compose freely and you never prop-drill.

The pattern (see `src/components/organisms/Accordion.tsx` and `molecules/Card.tsx`):

```tsx
const FooContext = createContext<FooValue | null>(null);
const useFoo = () => {
  const ctx = useContext(FooContext);
  if (!ctx) throw new Error('Foo.* must be used inside <Foo>');
  return ctx;
};

function FooRoot({ children, …state }: FooProps) {
  return <FooContext.Provider value={…}>{/* container */}{children}</FooContext.Provider>;
}
function FooHeader(props) { /* reads useFoo() if it needs shared state */ }
function FooContent(props) { /* … */ }

export const Foo = Object.assign(FooRoot, { Header: FooHeader, Content: FooContent });
```

Guidance:

- **Sub-components read shared state from context** (e.g. `Accordion.Trigger`
  reads open-state, `Alert.Icon` reads the tone). The caller wires nothing.
- **Throw a clear error** if a sub-component is used outside its root — it turns a
  confusing null into an obvious message.
- **Prefer RN built-ins over heavy deps**: `Accordion` animates with
  `LayoutAnimation`, not Reanimated. Reach for `@gorhom/bottom-sheet` (already a
  dep) only for true sheets/overlays (`BottomSheet`, `Select`).
- For managed selection groups, model the state in the root and expose `.Item`s
  that call back into context — see `RadioGroup`/`CheckboxGroup`.

## Step 4 — Write the story (CSF3) — it's also the test

Every component gets `Component.stories.tsx` next to it. Stories are the live docs
**and** the automated tests, so they must render without external wiring.

Follow `src/components/primitives/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'Primitives/Foo',          // Tier/Name — matches the folder
  component: Foo,
  args: { /* sensible defaults; see the gotcha below */ },
  argTypes: { variant: { control: 'select', options: [...] } },
  parameters: { notes: 'One-line description (shown by the on-device Notes addon).' },
} satisfies Meta<typeof Foo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { render: () => (/* every variant side by side */) };
export const OnDark: Story = { parameters: { theme: 'dark' } };  // forces dark theme
```

Rules that keep stories green:

- **Cover the axes**: a `Playground` (controls-driven) plus stories for each
  variant / size / state (loading, disabled, error). Add an `OnDark` for anything
  color-sensitive.
- **`satisfies Meta<typeof Component>` requires every required prop to be supplied
  in `meta.args`** — even for render-only stories. If the component has required
  props like `value`/`onChange`/`children`, put dummies in `meta.args`
  (`onChange: () => {}`, `children: null`); the `render` overrides them. (This is
  the single most common type error when adding stories.)
- **Stateful components**: wrap the demo in a named render function with `useState`
  (`render: function Playground() { const [v,setV]=useState(...); return <Foo value={v} onChange={setV}/> }`).
- **The theme decorator and providers are global** (`.rnstorybook/preview.tsx`) —
  don't re-wrap providers in a story.

## Step 5 — Register and verify

1. **Export** from the tier barrel (`primitives/index.ts`, `molecules/index.ts`, or
   `organisms/index.ts`) — type and component. The top-level `src/components/index.ts`
   re-exports all three tiers; consumers import from `'../components'`.
2. **Add the story module to the test runner**:
   `src/components/__tests__/stories.test.tsx` imports every story module and
   smoke-renders each story through the providers. Add your import + map entry.
   - Exception: components that mount `@gorhom/bottom-sheet` (sheets/Select) are
     excluded there — Reanimated's native worklets can't init under Jest. Verify
     those on-device instead, and add a focused behavior test in
     `interactions.test.tsx` if there's logic worth asserting.
3. **Run the checks**:
   ```sh
   yarn storybook-generate      # refresh the on-device story manifest
   npx tsc --noEmit             # types (stories included)
   yarn test                    # story smoke tests + interaction tests
   ```
   To see it on a simulator: `yarn storybook` then `yarn storybook:ios`.

## Definition of done

- Lands in the right tier folder; molecule/organism uses the compound + context pattern.
- Zero hard-coded style values — everything via `useTheme()`; semantic tokens only.
- Props extend the RN element, accept `style` (merged last), carry a11y props, and
  have JSDoc with an `@example`.
- Has a `*.stories.tsx` with Playground + variant/state coverage (+ dark where it
  matters), exported from the barrel and registered in `stories.test.tsx`.
- `tsc`, `yarn test`, and `yarn lint` are clean (inline-style warnings are the
  project norm; there should be no errors).
