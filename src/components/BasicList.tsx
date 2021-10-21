import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

interface BasicResource {
  id: any;
}

interface Props<T extends BasicResource> {
  data: T[];
  aspectRatio: number; // decimal numbers only. Ratio of the screen that each element should take.
  style?: StyleProp<ViewStyle>;
  renderItem: (item: T) => React.ReactNode;
}

export default function BasicList<T extends BasicResource>({
  data,
  aspectRatio,
  style,
  renderItem,
}: Props<T>) {
  const flexBasis = aspectRatio < 1 ? `${aspectRatio * 100}%` : '50%';

  return (
    <View style={style}>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {data.map(item => (
          <View
            key={item.id}
            style={{
              flexBasis,
              padding: 5,
            }}>
            {renderItem(item)}
          </View>
        ))}
      </View>
    </View>
  );
}
