# Tiramisu Design System

A themeable React Native component library based on the **Tiramisu Design System**
Pencil file (`.design/untitled.pen`) — a bold, violet-primary kit for the
roommate expense-splitter app. Tokens, light/dark themes, and components all
derive from that source.

## At a glance

- **Tokens** live in [`src/theme/theme.ts`](../theme/theme.ts) — semantic colors
  (shadcn-style), radii, spacing, and typography, for `light` and `dark`.
- **Components** are tiered under `src/components/{primitives,molecules,organisms}`
  and re-exported from [`src/components/index.ts`](./index.ts).
- **Stories** sit next to each component (`*.stories.tsx`) and power both the
  on-device Storybook and the Jest render tests.

```ts
import { Button, Card, FormField, Input, Alert } from '../components';
```

## Theming

Everything reads from the `useTheme()` hook — never hard-code a color, radius, or
font size.

```tsx
import { useTheme } from '../theme';

function Price() {
  const theme = useTheme();
  return <Text style={{ color: theme.colors.primary }}>₹480</Text>;
}
```

The app follows the OS color scheme via `ThemeProvider` (in `App.tsx`). Pass
`forcedScheme="dark"` to pin a theme (Storybook and tests use this).

### Token groups

- **Surfaces** — `background`, `card`, `popover`, `muted`, `tile`
- **Text/icons** — `foreground`, `mutedForeground`, `*Foreground` pairs
- **Brand** — `primary` / `primaryForeground`, `secondary` / `secondaryForeground`
- **Status** — `destructive`, and soft `success` / `warning` / `info` / `error`
  (each with a readable `*Foreground`)
- **Lines/focus** — `border`, `input`, `ring`
- **Radii** — `xs · sm · md · lg · xl · m · l · pill`; **spacing** — `spacing(n) = n × 4`

> Deprecated aliases (`bg`, `text`, `accent`, `danger`, …) still exist so the
> pre-existing screens keep working; new code should use the canonical names.

## Tiers

| Tier           | What                                  | Examples |
| -------------- | ------------------------------------- | -------- |
| **primitives** | atoms — one job, no composition       | `Text`, `Button`, `Icon`, `Avatar`, `Badge`, `Chip`, `Input`, `Textarea`, `Switch`, `Checkbox`, `Radio`, `OTPInput`, `Progress`, `Divider`, `Box`, `Stack`, `Screen` |
| **molecules**  | small compositions, **compound API**  | `Card.*`, `FormField.*`, `ListItem.*`, `Alert.*`, `SegmentedControl`, `AvatarGroup`, `RadioGroup`, `CheckboxGroup` |
| **organisms**  | interactive composites, **compound**  | `BottomSheet.*`, `Select`, `Accordion.*`, `Tabs.*`, `MonthSelector` |

### Compound components

Molecules and organisms expose sub-components as static properties, with shared
state passed through React context — not prop-drilled.

```tsx
<Accordion defaultValue="rent">
  <Accordion.Item value="rent">
    <Accordion.Trigger>Rent</Accordion.Trigger>
    <Accordion.Content><Text>₹18,000 split 3 ways</Text></Accordion.Content>
  </Accordion.Item>
</Accordion>
```

`Accordion.Trigger` reads the open state from `AccordionContext`; you never wire
it up manually.

## Storybook (on-device)

Stories run inside the real RN runtime on a simulator.

```sh
yarn storybook-generate      # regenerate the story manifest after adding stories
yarn storybook               # start Metro with STORYBOOK_ENABLED=true
yarn storybook:ios           # build & run the Storybook app on iOS
```

The global **Theme** toolbar toggles light/dark; on-device **Controls**,
**Actions**, **Notes**, and **Backgrounds** addons are enabled. Config is in
[`.rnstorybook/`](../../.rnstorybook).

## Testing

Stories double as tests. [`__tests__/stories.test.tsx`](./__tests__/stories.test.tsx)
renders every story through the same provider stack and asserts it mounts, and
[`__tests__/interactions.test.tsx`](./__tests__/interactions.test.tsx) covers key
interactions (press, toggle, expand).

```sh
yarn test                    # full suite
yarn test stories            # just the story render tests
```

> `BottomSheet` and `Select` are excluded from the Jest run (they pull
> `@gorhom/bottom-sheet` → Reanimated's native worklets, which can't init under
> node). They are verified on-device in Storybook.

## Adding a component

1. Decide the tier (see [SKILL](../../.claude/skills/) or the table above).
2. Create `Component.tsx` in the right folder. Follow the conventions:
   - named `function` component, props extend the underlying RN element
   - all styling from `useTheme()`, inline (no `StyleSheet.create`)
   - `style` prop merged last; JSDoc with an `@example`
   - molecules/organisms → compound API backed by context
3. Add `Component.stories.tsx` (CSF3) with a `Playground` plus variant/state
   stories; put required props in `meta.args`.
4. Export it from the tier's `index.ts`.
5. Add the story module to `__tests__/stories.test.tsx`.
6. `yarn storybook-generate && yarn test`.

## Fonts

Display = **Anton**, body = **Inter**, numeric = **Geist**. Drop the `.ttf` files
into [`src/assets/fonts/`](../assets/fonts/README.md) and run `npx react-native-asset`.
Until then, text falls back to the system font.
