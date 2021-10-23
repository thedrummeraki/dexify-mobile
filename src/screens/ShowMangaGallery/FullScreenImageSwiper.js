import React from 'react';
import ReactNativeImageSwiper from '@freakycoder/react-native-image-swiper';

import {Dimensions} from 'react-native';

export default function FullScreenImageSwiper({initialPage, images}) {
  const {height} = Dimensions.get('window');

  return (
    <ReactNativeImageSwiper
      imageHeight={height - 80}
      images={images}
      initialPage={initialPage}
    />
  );
}
