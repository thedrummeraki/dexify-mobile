import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';

export default function ImageGradient() {
  const colors = useGradientColors();

  return (
    <LinearGradient
      colors={colors}
      style={{
        flex: 1,
        width: '100%',
        aspectRatio: 1.2,
        position: 'absolute',
        zIndex: 1,
      }}
    />
  );
}

function useGradientColors() {
  const theme = useTheme();
  if (theme.dark) {
    return ['#00000000', '#00000050', '#000000A0', '#000000D0', '#000000F0'];
  }

  return ['#ffffff00', '#ffffff10', '#ffffff50', '#ffffffF0'];
}
