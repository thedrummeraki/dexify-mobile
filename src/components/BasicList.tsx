import React, {PropsWithChildren} from 'react';
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
  aspectRatio?: number; // decimal numbers only. Ratio of the screen that each element should take.
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  skeletonItem?: React.ReactElement;
  skeletonLength?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export default function BasicList<T extends BasicResource>({
  data,
  aspectRatio = 1 / 3,
  style,
  loading,
  skeletonItem,
  skeletonLength = 6,
  renderItem,
}: Props<T>) {
  const flexBasis = aspectRatio <= 1 ? `${aspectRatio * 100}%` : '50%';
  const basicListStyle: StyleProp<ViewStyle> = {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  if (loading) {
    return (
      <View style={style}>
        <View style={basicListStyle}>
          {Array.from({length: skeletonLength}).map((_, id) => (
            <BasicListItem id={String(id)} flexBasis={flexBasis}>
              {skeletonItem}
            </BasicListItem>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={style}>
      <View style={basicListStyle}>
        {data.map((item, index) => (
          <BasicListItem
            id={item.id || item.slug || `basic-list-${index}`}
            flexBasis={flexBasis}>
            {renderItem(item, index)}
          </BasicListItem>
        ))}
      </View>
    </View>
  );
}

function BasicListItem({
  children,
  id,
  flexBasis,
}: PropsWithChildren<{id: string; flexBasis: string}>) {
  return (
    <View key={id} style={{flexBasis, padding: 5}}>
      {children}
    </View>
  );
}
