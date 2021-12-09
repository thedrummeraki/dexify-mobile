import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation';

interface Props {
  title?: string;
  style?: StyleProp<ViewStyle>;
}

export default function CloseCurrentScreenHeader({title, style}: Props) {
  const navigation = useDexifyNavigation();

  return (
    <View
      style={Object.assign(
        {height: 55, zIndex: 100, flexDirection: 'row', alignItems: 'center'},
        style,
      )}>
      <IconButton icon="close" onPress={() => navigation.pop()} />
      {title ? (
        <Text numberOfLines={1} style={{marginLeft: 7, fontSize: 16}}>
          {title}
        </Text>
      ) : null}
    </View>
  );
}
