import React from 'react';
import {View} from 'react-native';

interface BasicResource {
  id: any;
}

interface Props<T extends BasicResource> {
  data: T[];
  aspectRatio: number; // decimal numbers only
  renderItem: (item: T) => React.ReactNode;
}

export default function BasicList<T extends BasicResource>({
  data,
  aspectRatio,
  renderItem,
}: Props<T>) {
  const flexBasis = aspectRatio < 1 ? `${aspectRatio * 100}%` : '50%';

  return (
    <View style={{paddingHorizontal: 10}}>
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
