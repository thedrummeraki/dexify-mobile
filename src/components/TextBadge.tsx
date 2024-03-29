import React, {PropsWithChildren} from 'react';
import {Text, useTheme} from 'react-native-paper';
import {BackgroundColor, useTextColor} from './colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleProp,
  TextStyle,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  content: React.ReactNode;
  numberOfLines?: number;
  background?: BackgroundColor | 'none';
  icon?: string;
  disablePress?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function TextBadge({
  content,
  numberOfLines,
  background = 'background',
  icon,
  style,
  textStyle,
  disablePress,
  onPress,
}: Props) {
  const theme = useTheme();
  const color = useTextColor(background !== 'none' ? background : undefined);
  const backgroundColor =
    background !== 'none' ? theme.colors[background] : undefined;

  return (
    <View
      style={Object.assign(
        {
          marginRight: 6,
          marginVertical: 2,
          borderRadius: 5,
          backgroundColor,
        },
        style,
      )}>
      <MaybeTouchable
        onPress={disablePress ? undefined : onPress}
        backgroundColor={backgroundColor || theme.dark ? '#fff' : '#000'}>
        <Text
          numberOfLines={numberOfLines}
          style={Object.assign(
            {
              color,
              paddingHorizontal: 4,
            },
            textStyle,
          )}>
          {icon && (
            <>
              <Icon name={icon} />{' '}
            </>
          )}
          {content}
        </Text>
      </MaybeTouchable>
    </View>
  );
}

function MaybeTouchable({
  onPress,
  backgroundColor,
  children,
}: PropsWithChildren<Pick<Props, 'onPress'>> & {backgroundColor: string}) {
  if (!onPress) {
    return <>{children}</>;
  }

  return (
    <TouchableNativeFeedback
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple(backgroundColor, true)}>
      <View>{children}</View>
    </TouchableNativeFeedback>
  );
}
