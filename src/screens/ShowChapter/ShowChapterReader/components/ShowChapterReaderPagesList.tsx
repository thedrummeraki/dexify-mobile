import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {ProgressBar} from 'react-native-paper';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {useDimensions, wait} from 'src/utils';
import {Page, ReaderActionState} from '../types';
import {useReaderContext} from './ReaderProvider';
import ShowChapterReaderActions from './ShowChapterReaderActions';
import ShowChapterReaderPage from './ShowChapterReaderPage';

interface Props {
  pages: Page[];
  initialIndex: number;
  onPageNumberChange?(pageNumber: number): void;
  onActionsStateChange?(state: ReaderActionState): void;
}

// Shows a VERTICAL list of pages
export default function ShowChapterReaderPagesList(props: Props) {
  const {pages, initialIndex, onPageNumberChange, onActionsStateChange} = props;
  const flatListRef = useRef<FlatList | null>();

  const {currentPage, onPageChange} = useReaderContext();

  const {height} = useDimensions();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [progress, setProgress] = useState(currentPage / pages.length);

  useEffect(() => {
    onPageNumberChange?.(currentPage);
  }, [currentPage]);

  useEffect(() => {
    onActionsStateChange?.(ReaderActionState.Initial);
    wait(3500).then(() => {
      setShowActions(false);
    });
  }, []);

  const progressBarAnimatedStyle = useAnimatedStyle(
    () => ({
      top: withTiming(showActions ? 60 : 0, {duration: 100}),
    }),
    [showActions],
  );

  return (
    <>
      <FlatList
        ref={ref => {
          flatListRef.current = ref;
        }}
        data={pages}
        keyExtractor={item => item.image.uri}
        pagingEnabled
        disableIntervalMomentum
        removeClippedSubviews
        snapToAlignment="center"
        snapToInterval={height}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        onScroll={e => {
          setProgress(
            (e.nativeEvent.contentOffset.y + height) / (height * pages.length),
          );
        }}
        onMomentumScrollEnd={e => {
          onPageChange(Math.round(e.nativeEvent.contentOffset.y / height) + 1);
        }}
        renderItem={({item: page}) => (
          <ShowChapterReaderPage
            key={page.number}
            page={page}
            onZoomStateChanged={zooming => setScrollEnabled(!zooming)}
            onActionsVisibilityChange={() =>
              setShowActions(current => !current)
            }
          />
        )}
        onLayout={() => {
          flatListRef.current?.scrollToIndex({index: initialIndex});
        }}
        onScrollToIndexFailed={() => {
          wait(500).then(() =>
            flatListRef.current?.scrollToIndex({
              index: initialIndex,
              animated: true,
            }),
          );
        }}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            flex: 1,
          },
          progressBarAnimatedStyle,
        ]}>
        <ProgressBar progress={progress} style={{height: 1}} />
      </Animated.View>
      <ShowChapterReaderActions
        visible={showActions}
        onPageSelect={page => {
          wait(500)
            .then(() => {
              flatListRef.current?.scrollToIndex({
                index: page - 1,
                animated: true,
              });
            })
            .finally(() => {
              onPageChange(page);
            });
        }}
      />
    </>
  );
}
