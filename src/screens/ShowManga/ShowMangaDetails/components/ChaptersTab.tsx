import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {ActivityIndicator, List} from 'react-native-paper';
import {Manga, PagedResultsList, Chapter} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import ChapterListItem from './ChapterListItem';

interface Props {
  manga: Manga;
}

export default function ChaptersTab({manga}: Props) {
  const {data, loading, error} = useGetRequest<PagedResultsList<Chapter>>(
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

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (error) {
    console.error(error);
    return <Text>Uh oh, could not fetch chapters for this manga.</Text>;
  }

  if (data?.result === 'ok' && data.data.length === 0) {
    return <Text>No chapters are available yet for this manga.</Text>;
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
