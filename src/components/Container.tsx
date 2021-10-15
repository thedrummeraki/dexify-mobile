import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';

export default function ScreenContainer({children}: PropsWithChildren<{}>) {
  return <View style={style.container}>{children}</View>;
}

const style = StyleSheet.create({
  container: {
    padding: 8,
  },
});
