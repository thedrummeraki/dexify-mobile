import React, {useEffect, useRef} from 'react';
import {FlatList, View} from 'react-native';
import {Button, Subheading, Title} from 'react-native-paper';
import {SecondaryAction} from 'src/categories';
import {wait} from 'src/utils';
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
  focusedIndex?: number;
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
  focusedIndex,
  renderItem,
}: Props<T>) {
  const flatListRef = useRef<FlatList | null>();

  const dimensions: ImageDimensions2D = imageDimensions
    ? imageDimensions.size
      ? {width: imageDimensions.size, height: imageDimensions.size}
      : (imageDimensions as ImageDimensions2D)
    : {height: 24, width: 24};

  useEffect(() => {
    if (focusedIndex !== undefined) {
      flatListRef.current?.scrollToIndex({animated: true, index: focusedIndex});
    }
  }, [focusedIndex]);

  if (loading) {
    return (
      <View style={{marginTop: 5, marginBottom: title ? 15 : 5}}>
        {title ? (
          <Subheading style={{marginHorizontal: 15}}>{title}</Subheading>
        ) : undefined}
        <FlatList
          horizontal={horizontal}
          data={Array.from({length: skeletonLength}).map((_, index) => index)} // 5 skeleton items
          style={{marginTop: 10}}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: title ? 15 : 5}}
          ListFooterComponent={<View style={{margin: 10}} />}
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
          <Subheading style={{marginHorizontal: 15}}>{title}</Subheading>
          {viewMore ? (
            <Button icon={viewMore.icon} onPress={viewMore.onAction}>
              {viewMore.content || 'More >'}
            </Button>
          ) : undefined}
        </View>
      ) : undefined}
      <FlatList
        ref={ref => (flatListRef.current = ref)}
        horizontal={horizontal}
        data={data}
        style={{marginTop: 10}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{marginHorizontal: title ? 15 : 5}}
        ListFooterComponent={<View style={{margin: 10}} />}
        initialScrollIndex={0}
        onScrollToIndexFailed={() => {
          if (focusedIndex !== undefined) {
            wait(500).then(() =>
              flatListRef.current?.scrollToIndex({
                index: focusedIndex,
                animated: true,
              }),
            );
          }
        }}
        renderItem={({item}) => (
          <View style={{marginRight: 10}}>{renderItem(item, dimensions)}</View>
        )}
      />
    </View>
  );
}
