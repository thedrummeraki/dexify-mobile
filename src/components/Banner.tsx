import React from 'react';
import {View} from 'react-native';
import {
  Subheading,
  IconButton,
  Paragraph,
  useTheme,
  Button,
  Text,
  Provider as PaperProvider,
} from 'react-native-paper';

type BannerColor =
  | 'primary'
  | 'surface'
  | 'accent'
  | 'error'
  | 'disabled'
  | 'notification';

interface BannerAction {
  content: string;
  onAction: () => void;
}

interface Props {
  visible?: boolean;
  title?: string;
  body?: string;
  background?: BannerColor;
  primaryAction?: BannerAction;
  secondaryAction?: BannerAction;
  onDismiss?: () => void;
}

const COLOR_MAP: {[key in 'dark' | 'light']: {[key in BannerColor]: string}} = {
  dark: {
    accent: '#222',
    disabled: '#ccc',
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

export default function Banner({
  visible = true,
  title,
  body,
  background = 'primary',
  primaryAction,
  secondaryAction,
  onDismiss,
}: Props) {
  const theme = useTheme();
  const colorScheme = theme.dark ? 'dark' : 'light';
  const textColor = COLOR_MAP[colorScheme][background];

  const paddingBottom = primaryAction || secondaryAction ? 15 : 20;

  if (!visible) {
    return null;
  }

  return (
    <PaperProvider
      theme={{...theme, colors: {...theme.colors, text: textColor}}}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors[background],
          paddingHorizontal: 20,
          paddingTop: 15,
          paddingBottom,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Subheading style={{fontWeight: '700', color: textColor}}>
            {title}
          </Subheading>
          {onDismiss && (
            <IconButton
              icon="close"
              size={18}
              style={{margin: 0}}
              onPress={onDismiss}
            />
          )}
        </View>
        <Paragraph>{body}</Paragraph>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {secondaryAction && (
              <Button compact mode="text" onPress={secondaryAction.onAction}>
                <Text>{secondaryAction.content}</Text>
              </Button>
            )}
            {primaryAction && (
              <Button compact mode="text" onPress={primaryAction.onAction}>
                <Text>{primaryAction.content}</Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </PaperProvider>
  );
}
