import React from 'react';
import {FlatList, View} from 'react-native';
import {Title} from 'react-native-paper';
import {ThumbnailSkeleton} from '../../foundation/Thumbnail';

interface ImageDimensions {
  width: number;
  height: number;
}

interface Props<T> {
  loading?: boolean;
  title: string;
  viewMore?: boolean;
  data: T[];
  dimensions: ImageDimensions;
  renderItem: (
    item: T,
    dimensions: ImageDimensions,
  ) => React.ReactElement | null;
}

export default function CategoriesCollectionSection<T>({
  loading,
  title,
  viewMore,
  data,
  dimensions,
  renderItem,
}: Props<T>) {
  if (loading) {
    return (
      <View style={{marginTop: 5}}>
        <Title style={{marginHorizontal: 20}}>{title}</Title>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]} // 5 skeleton items
          style={{marginTop: 10}}
          contentContainerStyle={{marginHorizontal: 5}}
          renderItem={() => (
            <View style={{marginLeft: 10}}>
              <ThumbnailSkeleton {...dimensions} />
            </View>
          )}
        />
      </View>
    );
  }
  return (
    <View style={{marginTop: 5}}>
      <Title style={{marginHorizontal: 20}}>{title}</Title>
      <FlatList
        horizontal
        data={data}
        style={{marginTop: 10}}
        contentContainerStyle={{marginHorizontal: 10}}
        renderItem={({item}) => (
          <View style={{marginRight: 10}}>{renderItem(item, dimensions)}</View>
        )}
      />
    </View>
  );
}
