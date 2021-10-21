import React from 'react';
import {ScrollView, View} from 'react-native';
import {List} from 'react-native-paper';
import {Manga, PagedResultsList, Chapter} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import ChapterListItem from './ChapterListItem';

interface Props {
  manga: Manga;
}

export default function ShowMangaDetailsChaptersTab({manga}: Props) {
  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    `https://api.mangadex.org/manga/${manga.id}/feed?translatedLanguage[]=en&limit=10`,
  );

  const chapters: {[key: string]: Chapter[]} = {};
  if (data?.result === 'ok') {
    for (const chapter of data.data) {
      const key = chapter.attributes.chapter || 'N/A';
      if (chapters[key]) {
        chapters[key].push(chapter);
      } else {
        chapters[key] = [chapter];
      }
    }
  }
  return (
    <ScrollView style={{flex: 1}}>
      <View>
        <View>
          <List.Section>
            {Object.entries(chapters).map(([number, list]) => (
              <ChapterListItem key={number} number={number} list={list} />
            ))}
          </List.Section>
        </View>
      </View>
    </ScrollView>
  );
}
