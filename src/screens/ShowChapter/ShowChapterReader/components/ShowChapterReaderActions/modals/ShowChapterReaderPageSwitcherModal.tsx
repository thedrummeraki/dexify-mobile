import React, {useCallback, useState} from 'react';
import {FullScreenModal} from 'src/components';
import {List} from 'src/components/List/List';
import {useReaderContext} from '../../ReaderProvider';

interface Props {
  visible: boolean;
  onDismiss(): void;
}

export default function ShowChapterReaderPageSwitcherModal({
  visible,
  onDismiss,
}: Props) {
  const {currentPage, pages, onPageChange} = useReaderContext();
  const [selectedPage, setSelectedPage] = useState(currentPage);

  const pagesAsResources = pages.map(page => ({
    title: `Page ${page.number}`,
    onPress: () => setSelectedPage(page.number),
    selected: selectedPage === page.number,
    image: {
      url: page.image.uri,
      width: 90,
    },
  }));

  const handleDismiss = useCallback(() => {
    onDismiss();
    onPageChange(selectedPage);
  }, [selectedPage]);

  return (
    <FullScreenModal
      visible={visible}
      title="Jump to page..."
      primaryAction={{content: 'Done', onAction: handleDismiss}}
      onDismiss={onDismiss}>
      <List data={pagesAsResources} />
    </FullScreenModal>
  );
}
