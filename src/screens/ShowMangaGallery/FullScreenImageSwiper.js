import React from 'react';
import ReactNativeImageSwiper from '@freakycoder/react-native-image-swiper';
import FastImage from 'react-native-fast-image';

import {Dimensions} from 'react-native';

export default function FullScreenImageSwiper({
  initialPage,
  images,
  onPageSelected,
}) {
  const {height} = Dimensions.get('window');

  return (
    <ReactNativeImageSwiper
      imageComponent={FastImage}
      imageHeight={height - 80}
      images={images}
      initialPage={initialPage}
      onPageSelected={onPageSelected}
    />
  );
}
