import React from 'react';
import ShowChapterReaderFooter from './ShowChapterReaderFooter';
import ShowChapterReaderHeader from './ShowChapterReaderHeader';

interface Props {
  visible: boolean;
  onPageSelect(page: number): void;
}

export default function ShowChapterReaderActions({
  visible,
  onPageSelect,
}: Props) {
  return (
    <>
      <ShowChapterReaderHeader visible={visible} />
      <ShowChapterReaderFooter visible={visible} onPageSelect={onPageSelect} />
    </>
  );
}
