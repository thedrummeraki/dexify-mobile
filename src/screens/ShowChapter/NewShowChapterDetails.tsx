import {rewriteURIForGET} from '@apollo/client';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Modal,
  Image,
  StyleSheet,
  View,
  Animated as RNAnimated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {CloseCurrentScreenHeader} from 'src/components';
import {useDexifyNavigation} from 'src/foundation';
import {ReadingDirection, useSettings} from 'src/prodivers';
import {max, min, useDimensions} from 'src/utils';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {transform} from '@babel/core';
import {Title} from 'react-native-paper';

interface Page {
  number: number;
  originalImageUrl: string;
  dataSaverImageUrl: string;
}

interface Props {
  pages: Page[];
  initialIndex: number;
  chapter: Chapter;
  // manga: Manga;
}

interface PageProps {
  page: Page;
  visible: boolean;
  onScaleUpdate(scale: number): void;
  onPreviousPage?(index: number): void;
  onNextPage?(index: number): void;
}

interface PageWithDimensionsProps {
  page: Page;
  visible: boolean;
  imageDimensions: {width: number; height: number};
  onScaleUpdate(scale: number): void;
  onPreviousPage?(index: number): void;
  onNextPage?(index: number): void;
}

interface PageState {
  prev: Page | null;
  current: Page | null;
  next: Page | null;
}

interface PanContext {
  x: number;
}

export default function NewShowChapterDetails({pages, initialIndex}: Props) {
  const {readingDirection} = useSettings();
  const {width, height} = useDimensions();

  console.log('device', {width, height});

  const navigation = useDexifyNavigation();

  const horizontal =
    readingDirection === ReadingDirection.LtR ||
    readingDirection === ReadingDirection.RtL;

  const readingReversed =
    readingDirection === ReadingDirection.RtL ||
    readingDirection === ReadingDirection.BtT;

  const [currentPageScale, setCurrentPageScale] = useState(1);

  const orderedPages = useMemo(() => {
    return readingReversed ? pages.sort(x => -x) : pages;
  }, [pages, readingReversed]);

  const offset = useSharedValue({x: 0, y: 0});
  const savedOffset = useSharedValue({x: 0, y: 0});
  const zooming = useSharedValue(false);
  const scale = useSharedValue(1);

  const dragGesture = Gesture.Pan()
    .onUpdate(e => {
      const y = e.translationY + savedOffset.value.y;
      if (zooming.value) {
        const leftLimit = width / 2;
        const rightLimit = -width / 2;
        const x = e.translationX + savedOffset.value.x;

        offset.value = {
          x: x < rightLimit ? rightLimit : x > leftLimit ? leftLimit : x,
          y: y > 0 ? 0 : y,
        };
      } else {
        offset.value = {
          x: 0,
          y: y > 0 ? 0 : y,
        };
      }
    })
    .onEnd(() => {
      console.log('onEnd', offset.value);
      savedOffset.value = {x: offset.value.x, y: offset.value.y};
    });

  const doubleTapGesture = Gesture.Tap()
    .maxDuration(1000)
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value === 1) {
        scale.value = withTiming(2, {duration: 100});
        zooming.value = true;
      } else {
        scale.value = withTiming(1, {duration: 100});
        zooming.value = false;

        // when zooming out, reset horizontal position
        offset.value = {...offset.value, x: 0};
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: offset.value.x},
      {translateY: offset.value.y},
      {scale: scale.value},
    ],
  }));

  const {width: pageWidth} = useDimensions();

  const translateX = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const clampedTranslateX = useDerivedValue(() => {
    const minTranslateX = Math.min(translateX.value, 0);
    const maxTranslateX = -pageWidth * (pages.length - 1);

    // return minTranslateX;
    return Math.max(minTranslateX, maxTranslateX);
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = clampedTranslateX.value;
    })
    .onUpdate(e => {
      translateX.value = e.translationX + savedTranslateX.value;
    })
    .onEnd(e => {
      translateX.value = withDecay({velocity: e.velocityX});
    });

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
      cancelAnimation(translateX);
    });

  const slideScrollViewGesture = Gesture.Race(tapGesture, panGesture);

  return (
    <>
      {/* <CloseCurrentScreenHeader /> */}

      {/* <ScrollView
        removeClippedSubviews
        scrollEventThrottle={40}
        onScrollBeginDrag={() => console.log('onScrollBeingDrag')}>
        {orderedPages.map(page => (
          <Page
            key={page.number}
            visible
            page={page}
            onScaleUpdate={setCurrentPageScale}
          />
        ))}
      </ScrollView> */}

      {/* <Animated.ScrollView
          removeClippedSubviews={false}
          style={[animatedStyles]}>
          {orderedPages.map((page, index) => (
            <Page
              key={page.number}
              visible
              page={page}
              onScaleUpdate={setCurrentPageScale}
            />
          ))}
        </Animated.ScrollView> */}
      <View style={{flex: 1}}>
        <GestureDetector gesture={slideScrollViewGesture}>
          <Animated.View style={{flex: 1, flexDirection: 'row'}}>
            {orderedPages.map((page, index) => (
              <TestPage
                key={String(index)}
                page={page}
                translateX={clampedTranslateX}
              />
            ))}
          </Animated.View>
        </GestureDetector>
      </View>
    </>
  );

  // return <Page uri={pages[0].dataSaverImageUrl} />;
}

function TestPage({
  page,
  translateX,
}: {
  page: Page;
  translateX: Animated.SharedValue<number>;
}) {
  const index = page.number - 1;
  const {width: pageWidth} = useDimensions();
  const pageOffset = pageWidth * index;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value + pageOffset}],
  }));

  return (
    <Animated.View
      key={String(index)}
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: `rgba(0, 0, 255, 0.${index + 2})`,
        },
        animatedStyle,
      ]}>
      <Title>Page {page.number}</Title>
    </Animated.View>
  );
}

function Page(props: PageProps) {
  const {page} = props;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const deviceDimensions = useDimensions();

  const {dataSaver} = useSettings();
  const uri = dataSaver ? page.dataSaverImageUrl : page.originalImageUrl;

  Image.getSize(
    uri,
    (width, height) => {
      setWidth(width);
      setHeight(height);
    },
    () => {
      setWidth(deviceDimensions.width);
      setHeight(deviceDimensions.height);
    },
  );

  if (width === 0 || height === 0) {
    return null;
  }

  return <PageWithDimensions imageDimensions={{width, height}} {...props} />;
}

function PageWithDimensions({page, imageDimensions}: PageWithDimensionsProps) {
  const {dataSaver} = useSettings();
  const uri = dataSaver ? page.dataSaverImageUrl : page.originalImageUrl;

  const {width: imageWidth, height: imageHeight} = imageDimensions;
  const {width: deviceWidth, height: deviceHeight} = useDimensions();

  const aspectRatio = imageWidth / imageHeight;

  const width = max(imageWidth, deviceWidth);
  const actualHeight = deviceWidth / aspectRatio;

  console.log({
    imageWidth,
    imageHeight,
    aspectRatio,
    deviceWidth,
    deviceHeight,
    actualHeight,
  });

  const offset = useSharedValue({x: 0, y: 0});
  const savedOffset = useSharedValue({x: 0, y: 0});
  const position = useSharedValue(0);
  const direction = useSharedValue<'r' | 'l' | null>(null);
  const zooming = useSharedValue(false);
  const scale = useSharedValue(1);
  const currentHeight = useSharedValue(actualHeight);
  // const viewHeight = useSharedValue(height);

  const dragGesture = Gesture.Pan()
    .shouldCancelWhenOutside(true)
    .onUpdate(event => {
      if (zooming.value) {
        console.log('allowing drag...');
      } else {
        console.log('not draging');
        offset.value = {x: 0, y: event.translationY};
      }
      // if (zooming.value) {
      offset.value = {
        x: event.translationX + savedOffset.value.x,
        y: event.translationY + savedOffset.value.y,
      };
      // } else {
      //   offset.value = {x: 0, y: 0};
      // }

      // console.log('onUpdate', event);
    })
    .onEnd(event => {
      if (zooming.value) {
        console.log('onEnd', event);
      }
      // savedOffset.value = {
      //   x: offset.value.x,
      //   y: offset.value.y,
      // };
    });

  const doubleTapGesture = Gesture.Tap()
    .maxDuration(1000)
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value === 1) {
        scale.value = withTiming(2, {duration: 100});
        currentHeight.value = withTiming(actualHeight * 2, {duration: 100});
        zooming.value = true;
      } else {
        scale.value = withTiming(1, {duration: 100});
        currentHeight.value = withTiming(actualHeight, {duration: 100});
        zooming.value = false;
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    height: currentHeight.value,
  }));

  const gesture = Gesture.Simultaneous(doubleTapGesture, dragGesture);

  return (
    <View
      style={{
        flex: 1,
        // position: 'absolute',
        // transform: [{translateY: (page.number - 1) * actualHeight}],
        marginBottom: 5,
      }}>
      <Image
        style={[
          {
            flex: 1,
            width: deviceWidth,
            aspectRatio,
            resizeMode: 'contain',
          },
        ]}
        source={{uri}}
      />
    </View>
  );
}

function PanGesture() {
  const count = 10;
  const backgroundColors = Array.from({length: count}).map(
    () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  );

  const {width, height} = useDimensions();

  const END_POSITION = 200;
  const isPressed = useSharedValue(false);
  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);

  console.log('position', position.value);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      console.log('onBegin');
      isPressed.value = true;
    })
    .onUpdate(e => {
      // if (onLeft.value) {
      //   position.value = e.translationX;
      // } else {
      //   position.value = END_POSITION + e.translationX;
      // }
      position.value = e.translationX;
      console.log('position.value', position.value);
    })
    .onEnd(e => {
      console.log('onEnd');
      // if (position.value > END_POSITION / 2) {
      //   position.value = withTiming(END_POSITION, {duration: 100});
      //   onLeft.value = false;
      // } else {
      //   position.value = withTiming(0, {duration: 100});
      //   onLeft.value = true;
      // }
      position.value = withTiming(0, {duration: 100});
      isPressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: position.value}],
    backgroundColor: isPressed.value ? 'blue' : 'yellow',
  }));

  console.log('transform', animatedStyle.transform);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}

function Ball() {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {scale: withSpring(isPressed.value ? 1.2 : 1)},
      ],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  const start = useSharedValue({x: 0, y: 0});
  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.ball, animatedStyles]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
    // transform: [{translateX: 200}],
  },
});
