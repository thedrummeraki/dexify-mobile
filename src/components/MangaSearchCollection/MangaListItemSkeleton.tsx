import React from 'react';
import {Dimensions} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

export default function MangaListItemSkeleton() {
  const imageWidth = 70;
  const width = Dimensions.get('window').width - 15 * 2 - imageWidth - 5 * 3;

  return (
    <SkeletonContent
      isLoading
      containerStyle={{
        width: '100%',
        height: 70,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      animationDirection="horizontalRight"
      layout={[
        {key: 'image', width: imageWidth, height: imageWidth},
        {key: 'text', width, height: 35, marginHorizontal: 15},
      ]}
      boneColor="#222"
      highlightColor="#333333"
    />
  );
}
