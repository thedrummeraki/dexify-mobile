import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

interface BasicResourceWithId {
  id: any;
}

interface BasicResourceWithSlug {
  slug: string;
}

type BasicResource = Partial<BasicResourceWithId & BasicResourceWithSlug>;

interface Props<T extends BasicResource> {
  data: T[];
  aspectRatio: number; // decimal numbers only. Ratio of the screen that each element should take.
  style?: StyleProp<ViewStyle>;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export default function BasicList<T extends BasicResource>({
  data,
  aspectRatio,
  style,
  renderItem,
}: Props<T>) {
  const flexBasis = aspectRatio <= 1 ? `${aspectRatio * 100}%` : '50%';

  return (
    <View style={style}>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {data.map((item, index) => (
          <View
            key={item.id || item.slug || `basic-list-${index}`}
            style={{
              flexBasis,
              padding: 5,
            }}>
            {renderItem(item, index)}
          </View>
        ))}
      </View>
    </View>
  );
}
