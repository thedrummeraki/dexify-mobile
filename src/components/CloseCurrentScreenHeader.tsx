import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation';

interface Props {
  title?: string;
  style?: StyleProp<ViewStyle>;
  onClose?(): void;
}

export default function CloseCurrentScreenHeader({
  title,
  style,
  onClose,
}: Props) {
  const navigation = useDexifyNavigation();

  const defaultOnClose = () => navigation.pop();

  return (
    <View
      style={Object.assign(
        {height: 55, zIndex: 100, flexDirection: 'row', alignItems: 'center'},
        style,
      )}>
      <IconButton icon="close" onPress={onClose || defaultOnClose} />
      {title ? (
        <Text numberOfLines={1} style={{marginLeft: 7, fontSize: 16}}>
          {title}
        </Text>
      ) : null}
    </View>
  );
}
