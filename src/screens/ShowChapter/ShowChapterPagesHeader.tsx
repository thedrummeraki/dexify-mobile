import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import {Caption, IconButton, Subheading} from 'react-native-paper';

interface Props {
  title: string;
  subtitle: string;
  fadeOutOnRender?: boolean;
  autoHideDelay?: number;
  hidden?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default function ShowChapterPagesHeader({
  title,
  subtitle,
  fadeOutOnRender,
  autoHideDelay = 1500,
  hidden,
  style,
  onPress,
}: Props) {
  const isDarkTheme = useColorScheme() === 'dark';
  const opacity = useState(new Animated.Value(hidden ? 0 : 1))[0];
  const canPerformAnimation = useRef(false);

  function fadeIn() {
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 1,
      duration: 400,
    }).start();
  }

  function fadeOut() {
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 0,
      duration: 400,
    }).start();
  }

  useEffect(() => {
    if (!canPerformAnimation.current) {
      canPerformAnimation.current = true;
      return;
    }

    if (hidden) {
      fadeOut();
    } else {
      fadeIn();
    }
  }, [hidden]);

  return (
    <Animated.View
      style={Object.assign(
        {
          opacity,
          zIndex: 1,
          backgroundColor: isDarkTheme ? '#222' : '#ddd',
          height: 48,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
        },
        style,
      )}>
      <View
        style={{
          flex: 1,
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <IconButton icon="arrow-left" onPress={onPress} />
        </View>
        <View
          style={{
            flex: 1,
            height: '100%',
          }}>
          <Subheading
            style={{marginTop: 5, paddingVertical: 0, marginVertical: 0}}>
            {title}
          </Subheading>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: -5,
            }}>
            <Caption style={{paddingBottom: 0, marginBottom: 0}}>
              {subtitle}
            </Caption>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
