import React, {useState} from 'react';
import {Image, ScrollView, TouchableNativeFeedback, View} from 'react-native';
import {
  Caption,
  Chip,
  List,
  Subheading,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import {
  CoverSize,
  findRelationship,
  findRelationships,
  mangaImage,
  preferredMangaTitle,
} from 'src/api';
import {
  Artist,
  Author,
  Chapter,
  Manga,
  PagedResultsList,
  SuccessEntityResponse,
} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useHeader} from 'src/prodivers';
import ShowMangaChapterItem from './ShowMangaChapterItem';

interface Props {
  manga: Manga;
}

export default function ShowMangaDetails({manga}: Props) {
  const title = Object.entries(manga.attributes.title)[0][1];

  const [showFullImage, setShowFullImage] = useState(false);
  const aspectRatio = showFullImage ? 1 : 2;

  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    `https://api.mangadex.org/manga/${manga.id}/feed?translatedLanguage[]=en`,
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

  const altTitle = manga.attributes.altTitles.find(
    title => title[manga.attributes.originalLanguage] || title.en,
  );

  const authors = findRelationships<Author>(manga, 'author');
  const artists = findRelationships<Artist>(manga, 'artist');

  return (
    <View>
      <TouchableNativeFeedback
        useForeground
        onPress={() => setShowFullImage(!showFullImage)}
        background={TouchableNativeFeedback.Ripple('#fff', false)}>
        <View>
          <Image
            source={{uri: mangaImage(manga, {size: CoverSize.Original})}}
            style={{width: '100%', aspectRatio}}
          />
        </View>
      </TouchableNativeFeedback>
      <View style={{padding: 5}}>
        <Title>{preferredMangaTitle(manga)}</Title>
        <Caption>
          {altTitle[manga.attributes.originalLanguage] || altTitle.en}
        </Caption>
        <Subheading>
          Written by: {authors.map(a => a.attributes.name).join(', ')}
        </Subheading>
      </View>
      <ScrollView>
        <View>
          <View style={{paddingHorizontal: 5}}>
            <Subheading>
              Illustration by: {artists.map(a => a.attributes.name).join(', ')}
            </Subheading>
          </View>
          <View>
            <List.Section
              title={`Chapters (${
                (data?.result === 'ok' && data.total) || '...'
              })`}>
              {Object.entries(chapters).map(([number, list]) => (
                <ShowMangaChapterItem
                  key={number}
                  number={number}
                  list={list}
                />
              ))}
            </List.Section>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
