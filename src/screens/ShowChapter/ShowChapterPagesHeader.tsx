import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import {Caption, IconButton, Subheading} from 'react-native-paper';
import {useSettings} from 'src/prodivers';

interface Props {
  title: string;
  subtitle: string;
  hidden?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default function ShowChapterPagesHeader({
  title,
  subtitle,
  hidden,
  style,
  onPress,
}: Props) {
  const {lightTheme} = useSettings();
  const opacity = useState(new Animated.Value(hidden ? 0 : 1))[0];
  const canPerformAnimation = useRef(false);

  const fadeIn = useCallback(() => {
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 1,
      duration: 400,
    }).start();
  }, []);

  const fadeOut = useCallback(() => {
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: 0,
      duration: 400,
    }).start();
  }, []);

  useEffect(() => {
    if (!canPerformAnimation.current) {
      canPerformAnimation.current = true;
      return;
    }

    hidden ? fadeOut() : fadeIn();
  }, [fadeOut, fadeIn, hidden]);

  return (
    <Animated.View
      style={Object.assign(
        {
          opacity,
          zIndex: 1,
          backgroundColor: lightTheme ? '#ddd' : '#222',
          height: 60,
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
          <IconButton
            icon="arrow-left"
            size={20}
            onPress={onPress}
            style={{marginHorizontal: 10}}
          />
        </View>
        <View
          style={{
            flex: 1,
            height: '100%',
          }}>
          <Subheading
            style={{marginTop: 10, paddingVertical: 0, marginVertical: 0}}>
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
