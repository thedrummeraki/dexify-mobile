import React, {ComponentProps} from 'react';
import {FlatList, StyleProp, ViewStyle} from 'react-native';
import {Item} from './Item';

interface BasicResourceWithId {
  id: any;
}

interface BasicResourceWithSlug {
  slug: string;
}

type BasicResource = Partial<BasicResourceWithId & BasicResourceWithSlug> &
  ComponentProps<typeof Item>;

type OtherFlatListProps = Pick<
  ComponentProps<typeof FlatList>,
  | 'ListHeaderComponent'
  | 'ListHeaderComponentStyle'
  | 'ListFooterComponent'
  | 'ListFooterComponentStyle'
  | 'ListEmptyComponent'
  | 'contentContainerStyle'
  | 'refreshControl'
>;

type Props<T extends BasicResource> = {
  data?: T[];
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  skeletonLength?: number;
  skeletonBorderRadius?: number;
  loading?: boolean;
  selected?: string[];
  onItemPress?(item: T): void;
} & OtherFlatListProps;

export function List<T extends BasicResource>(props: Props<T>) {
  const {
    data,
    loading,
    itemStyle,
    skeletonLength = 6,
    skeletonBorderRadius,
    selected,
    ListEmptyComponent,
    onItemPress,
    ...rest
  } = props;

  if (loading) {
    return (
      <FlatList
        data={Array.from({length: skeletonLength})}
        renderItem={() => (
          <List.Item.Skeleton
            imageWidth={70}
            borderRadius={skeletonBorderRadius}
          />
        )}
        contentContainerStyle={itemStyle}
        {...rest}
      />
    );
  }

  if (data === undefined) {
    return null;
  }

  return (
    <FlatList
      data={data || []}
      renderItem={({item}) => (
        <List.Item
          selected={
            selected?.includes(item.id) ||
            (item.slug && selected?.includes(item.slug))
          }
          onPress={() => onItemPress?.(item)}
          {...item}
        />
      )}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={itemStyle}
      {...rest}
    />
  );
}

List.Item = Item;
