import React, {PropsWithChildren} from 'react';
import {useTheme, Provider as PaperProvider} from 'react-native-paper';

export type BackgroundColor =
  | 'primary'
  | 'surface'
  | 'accent'
  | 'error'
  | 'disabled'
  | 'notification';

const COLOR_MAP: {
  [key in 'dark' | 'light']: {[key in BackgroundColor]: string};
} = {
  dark: {
    accent: '#222',
    disabled: '#eee',
    error: '#fff',
    notification: '#222',
    primary: '#222',
    surface: '#eee',
  },
  light: {
    accent: '#eee',
    disabled: '#333',
    error: '#fff',
    notification: '#222',
    primary: '#eee',
    surface: '#111',
  },
};

export function useTextColor(background?: BackgroundColor) {
  const theme = useTheme();
  return background
    ? COLOR_MAP[theme.dark ? 'dark' : 'light'][background]
    : theme.colors.text;
}

export function useBackgroundColor(
  background?: BackgroundColor,
  defaultValue?: string,
) {
  const theme = useTheme();
  return background
    ? theme.colors[background]
    : defaultValue || theme.colors.background;
}

export function PaperProviderForBackground({
  background,
  children,
}: PropsWithChildren<{
  background?: BackgroundColor;
}>) {
  const textColor = useTextColor(background);
  const theme = useTheme({colors: {text: textColor}});

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
