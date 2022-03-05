import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {preferredChapterTitle} from 'src/api';
import {Chapter, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import Thumbnail from 'src/foundation/Thumbnail';
import {useContinueReadingChaptersList} from 'src/prodivers';

export default function ReadingHistory() {
  const chaptersInfo = useContinueReadingChaptersList();

  const [getChapters] = useLazyGetRequest<PagedResultsList<Chapter>>();
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    getChapters(
      UrlBuilder.chaptersList({ids: chaptersInfo.map(info => info.id)}),
    ).then(result => {
      if (result?.result === 'ok') {
        setChapters(result.data);
      }
    });
  }, [chaptersInfo]);

  return (
    <FlatList
      data={chapters}
      renderItem={({item}) => {
        const chapterInfo = chaptersInfo.find(info => info.id === item.id);
        const mangaUrl =
          chapterInfo?.coverUrl || 'https://mangadex.org/avatar.png';

        return (
          <View style={{margin: 2.5}}>
            <Thumbnail
              imageUrl={mangaUrl}
              width={120}
              height={160}
              title={preferredChapterTitle(item)}
              subtitle={chapterInfo?.mangaName}
            />
          </View>
        );
      }}
      numColumns={3}
    />
  );
}

const dateRanges = [
  {name: 'Today'},
  {name: 'Yesterday'},
  {name: 'This week'},
  {name: 'This month'},
  {name: 'Last month'},
  {name: 'This year'},
];
