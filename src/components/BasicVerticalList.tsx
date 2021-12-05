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
  itemStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  skeletonItem?: React.ReactElement;
  skeletonLength?: number;
  HeaderComponent?: React.ReactElement;
  HeaderComponentStyle?: StyleProp<ViewStyle>;
  ListEmptyComponent?: React.ReactElement;
  renderItem?: (item: T, index: number) => React.ReactNode;
}

interface BasicVerticalListItemProps {
  id: string;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

export default function BasicVerticalList<T extends BasicResource>({
  data,
  style,
  itemStyle,
  loading,
  skeletonItem,
  skeletonLength = 6,
  HeaderComponent,
  HeaderComponentStyle,
  ListEmptyComponent,
  renderItem,
}: Props<T>) {
  const basicListStyle: StyleProp<ViewStyle> = {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  const headerMarkup = HeaderComponent && (
    <View style={HeaderComponentStyle}>{HeaderComponent}</View>
  );

  if (loading) {
    return (
      <View style={style}>
        {headerMarkup}
        <View style={basicListStyle}>
          {Array.from({length: skeletonLength}).map((_, id) => (
            <BasicVerticalListItem
              key={id}
              id={String(id)}
              style={{padding: 10}}
              itemStyle={itemStyle}>
              {skeletonItem}
            </BasicVerticalListItem>
          ))}
        </View>
      </View>
    );
  }

  if (!data || !renderItem) {
    if (renderItem) {
      return (
        <View style={style}>
          {headerMarkup}
          {ListEmptyComponent}
        </View>
      );
    }
    return null;
  }

  return (
    <View style={style}>
      {headerMarkup}
      <View style={basicListStyle}>
        {data.map((item, index) => (
          <BasicVerticalListItem
            key={item.id || item.slug || `basic-list-${index}`}
            id={item.id || item.slug || `basic-list-${index}`}
            style={{padding: 10}}
            itemStyle={itemStyle}>
            {renderItem(item, index)}
          </BasicVerticalListItem>
        ))}
      </View>
    </View>
  );
}

function BasicVerticalListItem({
  children,
  id,
  style,
  itemStyle,
}: PropsWithChildren<BasicVerticalListItemProps>) {
  return (
    <View key={id} style={Object.assign(style || {}, itemStyle)}>
      {children}
    </View>
  );
}
