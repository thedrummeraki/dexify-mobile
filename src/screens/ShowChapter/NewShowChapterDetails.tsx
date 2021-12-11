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
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import {ReadingDirection, useSettings} from 'src/prodivers';
import {max, min, useDimensions} from 'src/utils';

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

export default function NewShowChapterDetails({pages, initialIndex}: Props) {
  const {readingDirection} = useSettings();
  const {width, height} = useDimensions();

  const navigation = useDexifyNavigation();

  // const [pageState, setPageState] = useState<PageState>({
  //   prev: null,
  //   current: null,
  //   next: null,
  // });

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const [enable, setEnable] = useState(true);
  const ref = React.createRef();
  const scrollRef = React.createRef();

  const onScrollDown = useCallback(() => {
    if (!enable) {
      return null;
    }

    navigation.pop();
  }, [enable]);

  const horizontal =
    readingDirection === ReadingDirection.LtR ||
    readingDirection === ReadingDirection.RtL;

  const readingReversed =
    readingDirection === ReadingDirection.RtL ||
    readingDirection === ReadingDirection.BtT;

  const [currentPageScale, setCurrentPageScale] = useState(1);
  const [snapToDimension, setSnapToDimension] = useState(
    horizontal ? width : height,
  );

  useEffect(() => {
    if (pages.length === 0) {
      setActiveIndices([]);
    } else if (pages.length === 1) {
      setActiveIndices([0]);
    } else if (pages.length === 2) {
      setActiveIndices([0, 1]);
    } else if (currentIndex <= 0) {
      setActiveIndices([0, 1]);
    } else if (currentIndex < pages.length) {
      setActiveIndices([currentIndex - 1, currentIndex, currentIndex + 1]);
    } else {
      setActiveIndices([0, 1]);
    }
  }, [pages, currentIndex]);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const doubleTapGesture = Gesture.Tap()
    .maxDuration(1000)
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value === 1) {
        scale.value = withTiming(2, {duration: 400});
      } else {
        scale.value = withTiming(1, {duration: 400});
      }
    });

  const offset = useSharedValue({x: 0, y: 0});
  const savedOffset = useSharedValue({x: 0, y: 0});

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      // {scale: scale.value},
      {translateX: offset.value.x},
      {translateY: offset.value.y},
    ],
  }));

  // const zoomGesture = Gesture.Pinch()
  //   .onUpdate(event => {
  //     console.log('new scale', event.scale);
  //     scale.value = savedScale.value * event.scale;
  //     if (scale.value < 1) {
  //       scale.value = 1;
  //     }
  //   })
  //   .onEnd(() => {
  //     savedScale.value = scale.value;
  //     // zooming.value = scale.value > 1;
  //   });

  // useEffect(() => {
  //   setSnapToDimension((horizontal ? width : height) * currentPageScale);
  // }, [horizontal, currentPageScale, width, height]);

  const panGesture = Gesture.Pan()
    .onStart(e => {
      console.log('on drag', e);
      offset.value = {
        x: e.translationX + savedOffset.value.x,
        y: e.translationY + savedOffset.value.y,
      };
    })
    .onEnd(() => {
      savedOffset.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const gesture = Gesture.Simultaneous(panGesture, doubleTapGesture);

  const orderedPages = useMemo(() => {
    return readingReversed ? pages.sort(x => -x) : pages;
  }, [pages, readingReversed]);

  return (
    <GestureDetector gesture={gesture}>
      {/* <Animated.ScrollView
        horizontal={horizontal}
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // snapToInterval={snapToDimension * 2}
        removeClippedSubviews
        snapToAlignment="center"
        style={[animatedStyle]}>
        {orderedPages.map(page => (
          <Page
            key={page.number}
            visible
            page={page}
            onScaleUpdate={setCurrentPageScale}
          />
        ))}
      </
      Animated.ScrollView> */}
      {/* <Animated.View style={[{flex: 1, flexDirection: 'row'}, animatedStyle]}>
        {orderedPages.map(page => (
          <Page
            key={page.number}
            visible
            page={page}
            onScaleUpdate={setCurrentPageScale}
          />
        ))}
      </Animated.View> */}
      <ScrollView
        removeClippedSubviews
        // waitFor={enable ? ref : scrollRef}
        scrollEventThrottle={40}
        // onScroll={({nativeEvent}) => {
        //   if (nativeEvent.contentOffset.y <= 0 && !enable) {
        //     setEnable(true);
        //   }
        //   if (nativeEvent.contentOffset.y > 0 && enable) {
        //     setEnable(false);
        //   }
        // }}
      >
        {/* <PanGestureHandler
          enabled={enable}
          ref={ref}
          activeOffsetY={5}
          failOffsetY={-5}
          onGestureEvent={onScrollDown}>
          <Animated.View>
            {orderedPages.map(page => (
              <Page
                key={page.number}
                visible
                page={page}
                onScaleUpdate={setCurrentPageScale}
              />
            ))}
          </Animated.View>
        </PanGestureHandler> */}
        {orderedPages.map(page => (
          <Page
            key={page.number}
            visible
            page={page}
            onScaleUpdate={setCurrentPageScale}
          />
        ))}
      </ScrollView>
    </GestureDetector>
  );

  // return <Page uri={pages[0].dataSaverImageUrl} />;
}

function Page(props: PageProps) {
  const {page} = props;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const {dataSaver} = useSettings();
  const uri = dataSaver ? page.dataSaverImageUrl : page.originalImageUrl;

  Image.getSize(uri, (width, height) => {
    setWidth(width);
    setHeight(height);
  });

  const deviceDimensions = useDimensions();

  if (width === 0 || height === 0) {
    return null;
  }
  console.log('image is ', width, 'x', height, 'for AR', width / height);

  return <PageWithDimensions imageDimensions={{width, height}} {...props} />;
}

function PageWithDimensions({page, imageDimensions}: PageWithDimensionsProps) {
  const {dataSaver} = useSettings();
  const uri = dataSaver ? page.dataSaverImageUrl : page.originalImageUrl;

  console.log(uri);

  const {width: imageWidth, height: imageHeight} = imageDimensions;
  const {width: deviceWidth, height: deviceHeight} = useDimensions();

  const aspectRatio = imageWidth / imageHeight;
  console.log('aspectRatio', aspectRatio);

  const width = max(imageWidth, deviceWidth);
  const height = max(imageHeight, deviceHeight);

  const offset = useSharedValue({x: 0, y: 0});
  const savedOffset = useSharedValue({x: 0, y: 0});
  const position = useSharedValue(0);
  const direction = useSharedValue<'r' | 'l' | null>(null);
  const zooming = useSharedValue(false);
  const scale = useSharedValue(1);
  const viewHeight = useSharedValue(height);

  const dragGesture = Gesture.Pan()
    .onUpdate(event => {
      // if (zooming.value) {
      offset.value = {
        x: event.translationX + savedOffset.value.x,
        y: event.translationY + savedOffset.value.y,
      };
      // } else {
      //   offset.value = {x: 0, y: 0};
      // }

      console.log('onUpdate', event);
    })
    .onEnd(event => {
      savedOffset.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      console.log('onEnd', event);
    });

  const doubleTapGesture = Gesture.Tap()
    .maxDuration(1000)
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value === 1) {
        scale.value = withTiming(2, {duration: 400});
        viewHeight.value = withTiming(height * 1.5, {duration: 400});
      } else {
        scale.value = withTiming(1, {duration: 400});
        viewHeight.value = withTiming(height * 1, {duration: 400});
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const wrapperAnimatedStyles = useAnimatedStyle(() => ({
    height: viewHeight.value,
  }));

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <Animated.Image
        style={[
          {
            flex: 1,
            width: deviceWidth,
            aspectRatio,
            marginBottom: 5,
            resizeMode: 'contain',
          },
          animatedStyles,
        ]}
        source={{uri}}
      />
    </GestureDetector>
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
