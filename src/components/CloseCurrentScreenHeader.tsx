import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export default function CloseCurrentScreenHeader({style}: Props) {
  const navigation = useDexifyNavigation();

  return (
    <View style={Object.assign({height: 60}, style)}>
      <IconButton icon="close" onPress={() => navigation.pop()} />
    </View>
  );
}
