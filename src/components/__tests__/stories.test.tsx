/**
 * Smoke-tests every story in the design system: each one must mount without
 * throwing when rendered through the real Storybook preview decorator. This is
 * cheap, broad regression coverage — if a token rename or refactor breaks a
 * component, the matching story test fails.
 */
import { namedStories, renderStory, type StoryModule } from './storyRunner';

// Primitives
import * as Text from '../primitives/Text.stories';
import * as Box from '../primitives/Box.stories';
import * as Button from '../primitives/Button.stories';
import * as IconButton from '../primitives/IconButton.stories';
import * as Icon from '../primitives/Icon.stories';
import * as Avatar from '../primitives/Avatar.stories';
import * as Badge from '../primitives/Badge.stories';
import * as Chip from '../primitives/Chip.stories';
import * as Divider from '../primitives/Divider.stories';
import * as Input from '../primitives/Input.stories';
import * as Textarea from '../primitives/Textarea.stories';
import * as Switch from '../primitives/Switch.stories';
import * as Checkbox from '../primitives/Checkbox.stories';
import * as Radio from '../primitives/Radio.stories';
import * as OTPInput from '../primitives/OTPInput.stories';
import * as Progress from '../primitives/Progress.stories';

// Molecules
import * as Card from '../molecules/Card.stories';
import * as FormField from '../molecules/FormField.stories';
import * as ListItem from '../molecules/ListItem.stories';
import * as Alert from '../molecules/Alert.stories';
import * as SegmentedControl from '../molecules/SegmentedControl.stories';
import * as AvatarGroup from '../molecules/AvatarGroup.stories';
import * as RadioGroup from '../molecules/RadioGroup.stories';
import * as CheckboxGroup from '../molecules/CheckboxGroup.stories';

// Organisms
// NOTE: BottomSheet and Select are excluded here — they pull in @gorhom/bottom-sheet,
// which drags Reanimated's native worklets module into Jest (can't init in node).
// They are exercised on-device in Storybook instead.
import * as Accordion from '../organisms/Accordion.stories';
import * as Tabs from '../organisms/Tabs.stories';
import * as MonthSelector from '../organisms/MonthSelector.stories';

const modules: Record<string, StoryModule> = {
  Text,
  Box,
  Button,
  IconButton,
  Icon,
  Avatar,
  Badge,
  Chip,
  Divider,
  Input,
  Textarea,
  Switch,
  Checkbox,
  Radio,
  OTPInput,
  Progress,
  Card,
  FormField,
  ListItem,
  Alert,
  SegmentedControl,
  AvatarGroup,
  RadioGroup,
  CheckboxGroup,
  Accordion,
  Tabs,
  MonthSelector,
} as unknown as Record<string, StoryModule>;

describe('design system stories', () => {
  for (const [moduleName, mod] of Object.entries(modules)) {
    describe(moduleName, () => {
      for (const [storyName, story] of namedStories(mod)) {
        it(`renders "${storyName}"`, () => {
          const { toJSON, unmount } = renderStory(mod.default, story);
          expect(toJSON()).toBeTruthy();
          unmount();
        });
      }
    });
  }
});
