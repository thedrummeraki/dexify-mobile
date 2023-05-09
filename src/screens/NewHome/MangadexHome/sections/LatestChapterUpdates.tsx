import React from 'react';
import ChaptersSection from '../components/ChaptersSection';
import {useNewlyPublishedChapters} from '../hooks';

export default function LatestChapterUpdates() {
  const {chapters, manga, loading} = useNewlyPublishedChapters();

  return (
    <ChaptersSection
      section={{
        loading,
        chapters,
        manga,
        title: 'Latest chapter updates',
        type: 'chapters-list',
      }}
    />
  );
}
