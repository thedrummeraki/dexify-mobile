import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {
  TapGestureHandler,
  State,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDimensions} from 'src/utils';
import {Page} from '../types';

interface Props {
  page: Page;
  onZoomStateChanged?(zooming: boolean): void;
}

export function ShowChapterReaderPage(props: Props) {
  const {page, onZoomStateChanged} = props;

  const {
    image: {width: imageWidth, height: imageHeight, uri},
  } = page;
  const {width: deviceWidth, height: deviceHeight} = useDimensions();

  const aspectRatio = imageWidth / imageHeight;
  const actualHeight = deviceWidth / aspectRatio;

  const [zooming, setZooming] = useState(false);

  useEffect(() => {
    onZoomStateChanged?.(zooming);
  }, [zooming]);

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const savedPositionX = useSharedValue(0);
  const savedPositionY = useSharedValue(0);

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

  // const savedPosition = useSharedValue({x: 0, y: 0});

  const onDragImageGestureEvent = useAnimatedGestureHandler({
    onActive: e => {
      positionX.value = e.translationX / 2 + savedPositionX.value;
      positionY.value = e.translationY / 2 + savedPositionY.value;
    },
    onEnd: () => {
      savedPositionX.value = clampedPositionX.value;
      savedPositionY.value = clampedPositionY.value;
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

  // console.log({deviceHeight, deviceWidth, aspectRatio})

  return (
    <View
      style={{
        flex: 1,
        width: deviceWidth,
        height: deviceHeight,
        alignContent: 'center',
        justifyContent: 'center',
        borderColor: 'red',
        borderWidth: 1,
      }}>
      <TapGestureHandler
        waitFor={doubleTapRef}
        onHandlerStateChange={e => {
          if (e.nativeEvent.state === State.ACTIVE) {
            console.log(e.nativeEvent.absoluteX, e.nativeEvent.absoluteY);
          }
        }}
        onActivated={() => console.log('single tap')}>
        <Animated.View
          style={{
            width: deviceWidth,
            aspectRatio,
          }}>
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
            onActivated={e => {
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

export default React.memo(ShowChapterReaderPage, (prevProps, nextProps) => {
  return prevProps.page.image.uri === nextProps.page.image.uri;
});
