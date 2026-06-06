import { View, type ViewProps } from 'react-native';
import { useTheme } from '../theme';

export type StackProps = ViewProps & {
  gap?: number;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
};

export function Stack({
  gap = 3,
  direction = 'column',
  align,
  justify,
  style,
  ...rest
}: StackProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          gap: theme.spacing(gap),
        },
        style,
      ]}
      {...rest}
    />
  );
}
