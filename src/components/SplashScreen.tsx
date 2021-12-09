import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {useTheme} from 'react-native-paper';

export default function SplashScreen() {
  const theme = useTheme();
  const size = (Dimensions.get('screen').width * 2) / 3;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('src/images/logo-face-only.png')}
        width={size}
        height={size}
        style={{width: size, height: size}}
        borderRadius={size / 5}
      />
    </View>
  );
}
