import React, {useEffect, useRef} from 'react';
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
  autoHideDelay?: number;
  hidden?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default function ShowChapterPagesHeader({
  title,
  subtitle,
  autoHideDelay = 5000,
  hidden,
  style,
  onPress,
}: Props) {
  const isDarkTheme = useColorScheme() === 'dark';
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.cubic,
      delay: autoHideDelay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={Object.assign(
        {
          opacity: fadeAnim,
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
