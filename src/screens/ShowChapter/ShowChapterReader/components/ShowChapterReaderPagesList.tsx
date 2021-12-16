import React, {useEffect, useRef, useState} from 'react';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useDimensions, wait} from 'src/utils';
import {Page, ReaderActionState} from '../types';
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

  const {height} = useDimensions();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    onPageNumberChange?.(currentPage);
  }, [currentPage]);

  useEffect(() => {
    onActionsStateChange?.(ReaderActionState.Initial);
    if (initialIndex) {
      console.log('actully scrolling to', initialIndex);
      flatListRef.current?.scrollToIndex({index: initialIndex});
    }
  }, []);

  return (
    <FlatList
      ref={ref => (flatListRef.current = ref)}
      data={pages}
      keyExtractor={item => String(item.number)}
      initialScrollIndex={initialIndex}
      pagingEnabled
      disableIntervalMomentum
      removeClippedSubviews
      scrollEnabled={scrollEnabled}
      onMomentumScrollEnd={e => {
        setCurrentPage(Math.round(e.nativeEvent.contentOffset.y / height) + 1);
      }}
      renderItem={({item: page}) => (
        <ShowChapterReaderPage
          key={page.number}
          page={page}
          onZoomStateChanged={zooming => setScrollEnabled(!zooming)}
        />
      )}
      onScrollToIndexFailed={() => {
        wait(500).then(() =>
          flatListRef.current?.scrollToIndex({
            index: initialIndex,
            animated: true,
          }),
        );
      }}
    />
  );
}
