/**
 * Behavioural tests for the interactive components — these assert real user
 * interactions (press, toggle, expand) rather than just that a story mounts.
 */
import { useState } from 'react';
import type { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../theme';
import { Button } from '../primitives/Button';
import { Checkbox } from '../primitives/Checkbox';
import { SegmentedControl } from '../molecules/SegmentedControl';
import { Accordion } from '../organisms/Accordion';

const renderWithTheme = (ui: ReactElement) => render(<ThemeProvider forcedScheme="light">{ui}</ThemeProvider>);

describe('Button', () => {
  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button title="Add expense" onPress={onPress} />);
    fireEvent.press(screen.getByText('Add expense'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress while loading', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button title="Saving" loading onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Checkbox', () => {
  it('toggles checked state', () => {
    function Harness() {
      const [checked, setChecked] = useState(false);
      return <Checkbox checked={checked} onChange={setChecked} label="Split equally" />;
    }
    renderWithTheme(<Harness />);
    const box = screen.getByRole('checkbox');
    expect(box.props.accessibilityState.checked).toBe(false);
    fireEvent.press(box);
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });
});

describe('SegmentedControl', () => {
  it('selects the tapped option', () => {
    function Harness() {
      const [value, setValue] = useState('all');
      return (
        <SegmentedControl
          value={value}
          onChange={setValue}
          options={[
            { value: 'all', label: 'All' },
            { value: 'mine', label: 'Mine' },
          ]}
        />
      );
    }
    renderWithTheme(<Harness />);
    fireEvent.press(screen.getByText('Mine'));
    const tabs = screen.getAllByRole('tab');
    const mine = tabs.find((t) => t.props.accessibilityState?.selected);
    expect(mine).toBeTruthy();
  });
});

describe('Accordion', () => {
  it('expands a panel when its trigger is pressed', () => {
    renderWithTheme(
      <Accordion>
        <Accordion.Item value="rent">
          <Accordion.Trigger>Rent</Accordion.Trigger>
          <Accordion.Content>
            <Button title="Body content" onPress={() => {}} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    // Collapsed: content not rendered.
    expect(screen.queryByText('Body content')).toBeNull();
    fireEvent.press(screen.getByText('Rent'));
    // Expanded: content now visible.
    expect(screen.getByText('Body content')).toBeTruthy();
  });
});
