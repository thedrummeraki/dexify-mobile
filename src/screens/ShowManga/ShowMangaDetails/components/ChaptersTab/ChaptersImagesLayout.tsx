import React from 'react';
import {Button} from 'react-native-paper';
import {chapterImage} from 'src/api';
import {Chapter} from 'src/api/mangadex/types';
import BasicList from 'src/components/BasicList';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';

interface Props {
  loading: boolean;
  count: number;
  chapters: Chapter[];
}

export default function ChaptersImagesLayout({
  loading,
  count,
  chapters,
}: Props) {
  const navigation = useDexifyNavigation();
  if (loading) {
    return (
      <BasicList
        aspectRatio={1 / 3}
        data={Array.from({length: 3}).map(id => ({id}))}
        renderItem={() => (
          <Thumbnail
            imageUrl={'https://mangadex.org/avatar.png'}
            width="100%"
            aspectRatio={0.7}
          />
        )}
      />
    );
  }

  return (
    <BasicList
      data={chapters}
      aspectRatio={1 / 3}
      renderItem={item => {
        const {chapter, title: chapterTitle} = item.attributes;
        const title =
          chapter && chapterTitle
            ? `${chapter}) ${chapterTitle}`
            : chapterTitle
            ? chapterTitle
            : chapter
            ? `Chapter ${chapter}`
            : 'N/A';

        return (
          <Thumbnail
            imageUrl={chapterImage(item) || 'https://mangadex.org/avatar.png'}
            width="100%"
            aspectRatio={0.7}
            title={title}
            onPress={() => navigation.navigate('ShowChapter', {id: item.id})}
          />
        );
      }}
    />
  );
}