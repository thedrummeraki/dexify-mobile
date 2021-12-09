import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';

interface Props {
  aspectRatio?: number;
}

export default function ImageGradient({aspectRatio}: Props) {
  const colors = useGradientColors();

  return (
    <LinearGradient
      colors={colors}
      style={{
        flex: 1,
        width: '100%',
        aspectRatio,
        position: 'absolute',
        zIndex: 1,
      }}
    />
  );
}

function useGradientColors() {
  const theme = useTheme();
  const background = theme.dark ? '#000000' : '#f2f2f2';

  return [
    `${background}50`,
    `${background}20`,
    `${background}50`,
    `${background}A0`,
    `${background}D0`,
    `${background}FF`,
  ];
}
