import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import {FullScreenModal} from 'src/components';
import Thumbnail from 'src/foundation/Thumbnail';
import {wait} from 'src/utils';
import {useReaderContext} from '../../ReaderProvider';

interface Props {
  visible: boolean;
  onDismiss(): void;
  onPageChange(page: number): void;
}

export default function ShowChapterReaderPageSwitcherModal({
  visible,
  onDismiss,
  onPageChange,
}: Props) {
  const {currentPage, pages} = useReaderContext();
  const [selectedPage, setSelectedPage] = useState(currentPage);
  const flatListRef = useRef<FlatList | null>();

  const handleDismiss = useCallback(() => {
    onDismiss();
    onPageChange(selectedPage);
  }, [selectedPage]);

  useEffect(() => {
    if (!visible) {
      setSelectedPage(currentPage);
    }
  }, [visible, currentPage]);

  const focusedIndex = pages.findIndex(page => page.position === selectedPage);

  return (
    <FullScreenModal
      visible={visible}
      title="Jump to page..."
      primaryAction={{content: 'Done', onAction: handleDismiss}}
      onDismiss={onDismiss}>
      {/* <List data={pagesAsResources} selected={[String(selectedPage)]} /> */}
      <FlatList
        ref={ref => (flatListRef.current = ref)}
        data={pages}
        keyExtractor={item => item.image.uri}
        numColumns={2}
        onLayout={() => {
          flatListRef.current?.scrollToIndex({
            index: focusedIndex / 2,
            animated: true,
          });
        }}
        onScrollToIndexFailed={() => {
          if (focusedIndex !== undefined) {
            wait(500).then(() =>
              flatListRef.current?.scrollToIndex({
                index: focusedIndex / 2,
                animated: true,
              }),
            );
          }
        }}
        renderItem={({item}) => {
          return (
            <Thumbnail
              titleStyle={{marginBottom: 10}}
              imageUrl={item.image.uri}
              width={item.image.width}
              aspectRatio={1}
              title={`Page ${item.number}`}
              border={
                item.position === selectedPage
                  ? {color: 'red', width: 2}
                  : undefined
              }
              onPress={() => setSelectedPage(item.position)}
            />
          );
        }}
      />
    </FullScreenModal>
  );
}
