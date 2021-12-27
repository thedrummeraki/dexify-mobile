import React, {useEffect, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {
  PanGestureHandler,
  ScrollView,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Chapter} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import {useSettings} from 'src/prodivers';
import {useDimensions} from 'src/utils';
import ShowChapterPagesHeader from './ShowChapterPagesHeader';

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
  visible?: boolean;
  onPreviousPage?(index: number): void;
  onNextPage?(index: number): void;
  onZoomStateChanged?(zooming: boolean): void;
}

interface PageWithDimensionsProps extends PageProps {
  imageDimensions: {width: number; height: number};
}

interface ImagePosition {
  x: number;
  y: number;
}

export default function NewShowChapterDetails({chapter, pages}: Props) {
  const navigation = useDexifyNavigation();
  const {height} = useDimensions();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const headerCaptionContents = [
    chapter.attributes.volume
      ? `Volume ${chapter.attributes.volume}`
      : undefined,
    chapter.attributes.chapter
      ? `Chapter ${chapter.attributes.chapter}`
      : undefined,
  ]
    .filter(content => Boolean(content))
    .join(' - ');

  return (
    <View style={{flex: 1}}>
      <ShowChapterPagesHeader
        title={`Page ${currentPage}/${pages.length}`}
        subtitle={headerCaptionContents}
        onPress={() => navigation.pop()}
        hidden={!scrollEnabled}
      />
      <ScrollView
        removeClippedSubviews
        pagingEnabled
        disableIntervalMomentum
        scrollEnabled={scrollEnabled}
        snapToInterval={height}
        onMomentumScrollEnd={e => {
          setCurrentPage(
            Math.round(e.nativeEvent.contentOffset.y / height) + 1,
          );
        }}>
        {pages.map(page => (
          <Page
            key={page.number}
            page={page}
            onZoomStateChanged={zooming => setScrollEnabled(!zooming)}
          />
        ))}
      </ScrollView>
    </View>
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

function PageWithDimensions({
  page,
  imageDimensions,
  onZoomStateChanged,
}: PageWithDimensionsProps) {
  const {dataSaver} = useSettings();
  const uri = dataSaver ? page.dataSaverImageUrl : page.originalImageUrl;

  const {width: imageWidth, height: imageHeight} = imageDimensions;
  const {width: deviceWidth, height: deviceHeight} = useDimensions();

  const aspectRatio = imageWidth / imageHeight;
  const actualHeight = deviceWidth / aspectRatio;

  const [zooming, setZooming] = useState(false);

  useEffect(() => {
    onZoomStateChanged?.(zooming);
  }, [onZoomStateChanged, zooming]);

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const clampedPositionX = useDerivedValue(() => {
    const minTranslate = Math.min(positionX.value, deviceWidth / 4);
    const maxTranslate = Math.max(positionX.value, -deviceWidth / 4);

    if (positionX.value < 0) {
      // going right
      return maxTranslate;
    } else if (positionX.value > 0) {
      // going left
      return minTranslate;
    }

    return 0;
  });

  const clampedPositionY = useDerivedValue(() => {
    const minTranslate = Math.min(positionY.value, actualHeight / 5);
    const maxTranslate = Math.max(positionY.value, -actualHeight / 5);

    if (positionY.value < 0) {
      // going down
      return maxTranslate;
    } else if (positionY.value > 0) {
      // going up
      return minTranslate;
    }

    return 0;
  });

  const saved = useSharedValue<ImagePosition>({x: 0, y: 0});

  const onDragImageGestureEvent = useAnimatedGestureHandler({
    onActive: e => {
      positionX.value = e.translationX / 2 + saved.value.x;
      positionY.value = e.translationY / 2 + saved.value.y;
    },
    onEnd: () => {
      saved.value = {
        x: clampedPositionX.value,
        y: clampedPositionY.value,
      };
    },
  });

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: clampedPositionX.value},
      {translateY: clampedPositionY.value},
    ],
  }));

  const doubleTapRef = useRef(null);

  return (
    <View
      style={{
        flex: 1,
        width: deviceWidth,
        height: deviceHeight,
        alignContent: 'center',
        justifyContent: 'center',
      }}>
      <TapGestureHandler
        waitFor={doubleTapRef}
        onHandlerStateChange={e => {
          if (e.nativeEvent.state === State.ACTIVE) {
            console.log(e.nativeEvent.absoluteX, e.nativeEvent.absoluteY);
          }
        }}
        onActivated={() => console.log('single tap')}>
        <Animated.View style={{width: deviceWidth, aspectRatio}}>
          <TapGestureHandler
            ref={doubleTapRef}
            onHandlerStateChange={e => {
              if (e.nativeEvent.state === State.ACTIVE) {
                scale.value = withTiming(scale.value === 1 ? 2 : 1);
                if (scale.value === 1) {
                  scale.value = withTiming(2);
                  // TODO: figure out where to go when double tapping on image
                  // positionX.value = e.nativeEvent.absoluteX;
                  // positionY.value = e.nativeEvent.absoluteY;
                  // console.log(e.nativeEvent);
                } else {
                  scale.value = withTiming(1);
                  positionX.value = withTiming(0);
                  positionY.value = withTiming(0);
                }
              }
            }}
            onActivated={() => {
              setZooming(zooming => !zooming);
            }}
            numberOfTaps={2}
            maxDurationMs={1000}>
            <Animated.View>
              <PanGestureHandler
                enabled={zooming}
                onGestureEvent={onDragImageGestureEvent}>
                <Animated.Image
                  style={[
                    {
                      width: deviceWidth,
                      aspectRatio,
                      resizeMode: 'cover',
                    },
                    animatedStyle,
                  ]}
                  source={{uri}}
                />
              </PanGestureHandler>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
}
