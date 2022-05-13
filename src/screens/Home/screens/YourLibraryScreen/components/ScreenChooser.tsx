import React from 'react';
import {AddedManga} from '.';
import {LibraryFilter} from '../YourLibraryScreen';
import MDLists from './MDLists/MDLists';
import ReadingHistory from './ReadingHistory';

interface Props {
  filter: LibraryFilter;
}

export default function ScreenChooser({filter}: Props) {
  switch (filter) {
    case LibraryFilter.Added:
      return <AddedManga />;
    case LibraryFilter.Lists:
      return <MDLists />;
    case LibraryFilter.ReadingHistory:
      return <ReadingHistory />;
    default:
      return null;
  }
}
