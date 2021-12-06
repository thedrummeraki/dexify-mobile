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
  if (theme.dark) {
    return [
      `${theme.colors.background}80`,
      `${theme.colors.background}40`,
      `${theme.colors.background}00`,
      `${theme.colors.background}00`,
      `${theme.colors.background}00`,
      `${theme.colors.background}50`,
      `${theme.colors.background}A0`,
      `${theme.colors.background}D0`,
      `${theme.colors.background}FF`,
    ];
  }

  return ['#ffffff00', '#ffffff10', '#ffffff50', '#ffffffF0'];
}
