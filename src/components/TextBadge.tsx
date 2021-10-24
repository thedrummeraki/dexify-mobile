import React, {PropsWithChildren} from 'react';
import {Text, useTheme} from 'react-native-paper';
import {BackgroundColor, useTextColor} from './colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleProp,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  content: React.ReactText;
  background?: BackgroundColor;
  icon?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function TextBadge({
  content,
  background,
  icon,
  style,
  onPress,
}: Props) {
  const theme = useTheme();
  const color = useTextColor(background);
  const backgroundColor = background && theme.colors[background];

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
        onPress={onPress}
        backgroundColor={backgroundColor || theme.dark ? '#fff' : '#000'}>
        <Text
          style={{
            color,
            paddingHorizontal: 4,
          }}>
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
