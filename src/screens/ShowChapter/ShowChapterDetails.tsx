import React, {useMemo} from 'react';
import {Chapter} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import ShowChapterPages from './ShowChapterPages';

interface Props {
  chapter: Chapter;
}

interface Page {
  number: number;
  imageUrl: string;
}

export default function ShowChapterDetails({chapter}: Props) {
  const pages: Page[] = useMemo(() => {
    return chapter.attributes.data.map((filename, index) => ({
      number: index + 1,
      imageUrl: filename,
    }));
  }, [chapter]);

  const {data, loading} = useGetRequest<{baseUrl: string}>(
    `https://api.mangadex.org/at-home/server/${chapter.id}`,
  );
  if (data?.baseUrl) {
    return (
      <ShowChapterPages
        pages={chapter.attributes.data.map((_, index) => ({
          number: index + 1,
          originalImageUrl: [
            data.baseUrl,
            'data',
            chapter.attributes.hash,
            chapter.attributes.data[index],
          ].join('/'),
          dataSaverImageUrl: [
            data.baseUrl,
            'data-saver',
            chapter.attributes.hash,
            chapter.attributes.dataSaver[index],
          ].join('/'),
        }))}
      />
    );
  }

  return null;
}
