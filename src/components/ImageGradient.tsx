import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "react-native-paper";

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
  )
}

function useGradientColors() {
  const theme = useTheme();
  const opacityLevels = {
    dark: ['00', '50', 'A0', 'D0', 'F0'],
    light: ['00', '10', '50', 'F0'],
  }

  const toBackground = {
    dark: '#000000',
    light: '#ffffff',
  }

  const themedOpacityLevels = theme.dark ? opacityLevels.dark : opacityLevels.light;
  const themedToBackground = theme.dark ? toBackground.dark : toBackground.light;
  return themedOpacityLevels.map((opacityLevel) => `${themedToBackground}${opacityLevel}`);
}
