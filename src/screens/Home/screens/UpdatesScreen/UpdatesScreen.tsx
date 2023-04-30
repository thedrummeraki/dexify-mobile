import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Subheading, Text, Title} from 'react-native-paper';
import {
  findRelationship,
  preferredChapterTitle,
  preferredMangaTitle,
} from 'src/api';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {Chapter, EntityResponse, Manga} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useGetRequest} from 'src/api/utils';
import {Banner} from 'src/components';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import MangaThumbnail from 'src/components/MangaThumbnail';
import ChaptersSection from 'src/screens/NewHome/Feed/Section/components/ChaptersSection';
import {ChapterItem} from 'src/screens/ShowManga/ShowMangaDetails/components/AboutTab/ChaptersList';
import {notEmpty, useDimensions} from 'src/utils';

interface MangaChaptersMapping {
  manga: Manga;
  chapters: Chapter[];
}

export default function UpdatesScreen() {
  const {data, loading, error} = useGetRequest<EntityResponse<Chapter>>(
    UrlBuilder.userFollowChaptersFeed({
      order: {readableAt: 'desc'},
      includes: ['user', 'scanlation_group'],
    }),
  );
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [mangas, setMangas] = useState<Manga[]>([]);

  const dimensions = useDimensions();

  useEffect(() => {
    if (data?.result === 'ok') {
      setChapters(data.data);
    }
  }, [data]);

  const [fetchManga] = useLazyGetMangaList();
  const mangaIds = useMemo(() => {
    const result: string[] = [];
    chapters.forEach(chapter => {
      const mangaId = findRelationship(chapter, 'manga')?.id;
      if (mangaId && !result.includes(mangaId)) {
        result.push(mangaId);
      }
    });

    return result;
  }, [chapters]);

  useEffect(() => {
    if (mangaIds.length) {
      fetchManga({ids: mangaIds, limit: 100})
        .then(response => {
          if (response?.result === 'ok') {
            setMangas(response.data);
          } else {
            console.error(response?.errors);
          }
        })
        .catch(console.error);
    }
  }, [mangaIds]);

  if (loading) {
    return (
      <View>
        <Title>Updates</Title>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (data?.result === 'error' || error) {
    console.error(data?.result === 'error' ? data.errors : error);
    return (
      <View>
        <Title>Updates</Title>
        <Banner title="Error">Could not fetch updates</Banner>
      </View>
    );
  }

  if (!data?.data) {
    return (
      <View>
        <Title>Updates</Title>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={mangas}
        renderItem={({item: manga}) => {
          const matchingChapters = chapters
            .filter(
              chapter => findRelationship(chapter, 'manga')?.id === manga.id,
            )
            .sort((a, b) =>
              b.attributes.publishAt.localeCompare(a.attributes.publishAt),
            )
            .slice(0, 10);

          return (
            <ChaptersSection
              section={{
                chapters: matchingChapters,
                manga: [manga],
                title: preferredMangaTitle(manga),
                type: 'chapters-list',
              }}
            />
          );
        }}
      />
    </View>
  );
}
