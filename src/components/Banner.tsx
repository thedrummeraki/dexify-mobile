import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {
  Subheading,
  IconButton,
  Paragraph,
  useTheme,
  Button,
  Text,
} from 'react-native-paper';
import {
  BackgroundColor,
  PaperProviderForBackground,
  useTextColor,
} from './colors';

interface BannerAction {
  content: string;
  onAction: () => void;
}

interface Props {
  visible?: boolean;
  title?: string;
  body?: string;
  background?: BackgroundColor;
  primaryAction?: BannerAction;
  secondaryAction?: BannerAction;
  onDismiss?: () => void;
}

export default function Banner({
  visible = true,
  title,
  body,
  children,
  background = 'primary',
  primaryAction,
  secondaryAction,
  onDismiss,
}: PropsWithChildren<Props>) {
  const theme = useTheme();
  const textColor = useTextColor(background);

  const paddingBottom = primaryAction || secondaryAction ? 15 : 20;

  if (!visible) {
    return null;
  }

  return (
    <PaperProviderForBackground background={background}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors[background],
          paddingHorizontal: 15,
          paddingTop: 20,
          paddingBottom,
          marginBottom: 10,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {title && (
            <Subheading
              style={{fontWeight: '700', color: textColor, marginTop: -5}}>
              {title}
            </Subheading>
          )}
          {onDismiss && (
            <IconButton
              icon="close"
              size={18}
              style={{margin: 0}}
              onPress={onDismiss}
            />
          )}
        </View>
        <Paragraph>{body || children}</Paragraph>
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
    </PaperProviderForBackground>
  );
}
