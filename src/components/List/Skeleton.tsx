import React from 'react';
import {Dimensions} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

interface Props {
  imageWidth?: number;
  borderRadius?: number;
}

export default function Skeleton({imageWidth = 0, borderRadius = 0}: Props) {
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
        marginBottom: 5,
      }}
      animationDirection="horizontalRight"
      layout={[
        {key: 'image', width: imageWidth, height: imageWidth, borderRadius},
        {
          key: 'text',
          width,
          height: imageWidth ? 35 : 65,
          marginHorizontal: 15,
        },
      ]}
      boneColor="#222"
      highlightColor="#333333"
    />
  );
}
