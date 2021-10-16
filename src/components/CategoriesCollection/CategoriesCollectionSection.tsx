import React from 'react';
import {FlatList, View} from 'react-native';
import {Title} from 'react-native-paper';
import {ThumbnailSkeleton} from '../../foundation/Thumbnail';

interface ImageDimensions {
  width: number;
  height: number;
}

interface Props<T> {
  title: string;
  data: T[];
  dimensions: ImageDimensions;
  loading?: boolean;
  viewMore?: boolean;
  skeletonLength?: number;
  renderItem: (
    item: T,
    dimensions: ImageDimensions,
  ) => React.ReactElement | null;
}

export default function CategoriesCollectionSection<T>({
  title,
  data,
  dimensions,
  loading,
  viewMore,
  skeletonLength = 5,
  renderItem,
}: Props<T>) {
  if (loading) {
    return (
      <View style={{marginTop: 5}}>
        <Title style={{marginHorizontal: 20}}>{title}</Title>
        <FlatList
          horizontal
          data={Array.from({length: skeletonLength})} // 5 skeleton items
          style={{marginTop: 10}}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: 10}}
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
    <View style={{marginTop: 5, marginBottom: 15}}>
      <Title style={{marginHorizontal: 20}}>{title}</Title>
      <FlatList
        horizontal
        data={data}
        style={{marginTop: 10}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{marginHorizontal: 20}}
        renderItem={({item}) => (
          <View style={{marginRight: 10}}>{renderItem(item, dimensions)}</View>
        )}
      />
    </View>
  );
}
