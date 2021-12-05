import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

export default function MangaListItemSkeleton() {
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
        {key: 'image', width: 70, height: 70},
        {key: 'text', width: '80%', height: 35, marginLeft: 5},
      ]}
      boneColor="#222"
      highlightColor="#333333"
    />
  );
}
