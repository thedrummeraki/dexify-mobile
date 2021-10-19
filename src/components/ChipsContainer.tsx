import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Chip} from 'react-native-paper';

interface Props<T> {
  data: T[];
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  additionalChip?: {
    content: string;
    key?: React.Key | null;
    icon?: string;
    onAction?: () => void;
  };
  renderChip(item: T): React.ReactElement;
  keyExtractor?(item: T): React.Key | null;
}

export default function ChipsContainer<T>({
  data,
  style,
  itemStyle,
  additionalChip,
  keyExtractor,
  renderChip,
}: Props<T>) {
  return (
    <View
      style={Object.assign(
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
        },
        style,
      )}>
      {data.map(item => (
        <View key={keyExtractor && keyExtractor(item)} style={itemStyle}>
          {renderChip(item)}
        </View>
      ))}
      {additionalChip && (
        <View key={additionalChip.key} style={itemStyle}>
          <Chip
            icon={additionalChip.icon}
            onPress={additionalChip.onAction}
            style={{backgroundColor: '#222'}}>
            {additionalChip.content}
          </Chip>
        </View>
      )}
    </View>
  );
}
