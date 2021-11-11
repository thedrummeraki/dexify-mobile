import React from 'react';
import {FlatList, View} from 'react-native';
import {Button, Title} from 'react-native-paper';
import {SecondaryAction} from 'src/categories';
import {ThumbnailSkeleton} from '../../foundation/Thumbnail';

interface BasicImageDimensions {
  width?: number;
  height?: number;
  size?: number;
}

interface ImageDimensions2D extends BasicImageDimensions {
  width: number;
  height: number;
  size?: undefined;
}

interface ImageDimensionsSimple extends BasicImageDimensions {
  size: number;
  width?: undefined;
  height?: undefined;
}

type ImageDimensions = ImageDimensions2D | ImageDimensionsSimple;

interface Props<T> {
  horizontal?: boolean;
  title?: string;
  data: T[];
  dimensions?: ImageDimensions;
  loading?: boolean;
  viewMore?: SecondaryAction; // only visible when title is present
  skeletonLength?: number;
  SkeletonItem?: React.ReactElement;
  renderItem: (
    item: T,
    dimensions: ImageDimensions,
  ) => React.ReactElement | null;
}

export default function CategoriesCollectionSection<T>({
  horizontal = true,
  title,
  data,
  dimensions: imageDimensions,
  loading,
  viewMore,
  skeletonLength = 5,
  SkeletonItem,
  renderItem,
}: Props<T>) {
  const dimensions: ImageDimensions2D = imageDimensions
    ? imageDimensions.size
      ? {width: imageDimensions.size, height: imageDimensions.size}
      : (imageDimensions as ImageDimensions2D)
    : {height: 24, width: 24};

  if (loading) {
    return (
      <View style={{marginTop: 5, marginBottom: title ? 15 : 5}}>
        {title ? (
          <Title style={{marginHorizontal: 20}}>{title}</Title>
        ) : undefined}
        <FlatList
          horizontal={horizontal}
          data={Array.from({length: skeletonLength}).map((_, index) => index)} // 5 skeleton items
          style={{marginTop: 10}}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: title ? 20 : 5}}
          renderItem={({item}) => (
            <View key={String(item)} style={{marginRight: 10}}>
              {SkeletonItem || <ThumbnailSkeleton {...dimensions} />}
            </View>
          )}
        />
      </View>
    );
  }
  return (
    <View style={{marginTop: 5, marginBottom: title ? 15 : 5}}>
      {title ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Title style={{marginHorizontal: 20}}>{title}</Title>
          {viewMore ? (
            <Button icon={viewMore.icon} onPress={viewMore.onAction}>
              {viewMore.content || 'More >'}
            </Button>
          ) : undefined}
        </View>
      ) : undefined}
      <FlatList
        horizontal={horizontal}
        data={data}
        style={{marginTop: 10}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{marginHorizontal: title ? 20 : 5}}
        renderItem={({item}) => (
          <View style={{marginRight: 10}}>{renderItem(item, dimensions)}</View>
        )}
      />
    </View>
  );
}
