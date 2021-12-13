import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useDimensions} from 'src/utils';
import {Page, ReaderActionState} from '../types';
import ShowChapterReaderPage from './ShowChapterReaderPage';

interface Props {
  pages: Page[];
  onPageNumberChange?(pageNumber: number): void;
  onActionsStateChange?(state: ReaderActionState): void;
}

// Shows a VERTICAL list of pages
export default function ShowChapterReaderPagesList(props: Props) {
  const {pages, onPageNumberChange, onActionsStateChange} = props;

  const {height} = useDimensions();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    onPageNumberChange?.(currentPage);
  }, [currentPage]);

  useEffect(() => {
    onActionsStateChange?.(ReaderActionState.Initial);
  }, []);

  return (
    <ScrollView
      pagingEnabled
      removeClippedSubviews
      disableIntervalMomentum
      scrollEnabled={scrollEnabled}
      onMomentumScrollEnd={e => {
        setCurrentPage(Math.round(e.nativeEvent.contentOffset.y / height) + 1);
      }}>
      {pages.map(page => (
        <ShowChapterReaderPage
          key={page.number}
          page={page}
          onZoomStateChanged={zooming => setScrollEnabled(!zooming)}
        />
      ))}
    </ScrollView>
  );
}
