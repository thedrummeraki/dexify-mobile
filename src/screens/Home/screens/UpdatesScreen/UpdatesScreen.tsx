import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {Title} from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {findRelationship} from 'src/api';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {Chapter, EntityResponse, Manga} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useAuthenticatedLazyGetRequest} from 'src/api/utils';
import {Banner} from 'src/components';
import MangaChaptersPreview from './components/MangaChaptersPreview';

export default function UpdatesScreen() {
  const [getUpdates, {data, loading, error}] = useAuthenticatedLazyGetRequest<
    EntityResponse<Chapter[]>
  >(
    UrlBuilder.userFollowChaptersFeed({
      order: {readableAt: 'desc'},
      includes: ['user', 'scanlation_group'],
    }),
  );
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getUpdates()
      .catch(console.error)
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    getUpdates();
  }, []);

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
      <ScreenContainer title="Updates">
        <FlatList
          data={Array.from({length: 10}).map(
            (_, index) => `skeleton-item-${index}`,
          )}
          style={{marginBottom: 65}}
          ItemSeparatorComponent={() => <View style={{height: 16}} />}
          contentContainerStyle={{paddingHorizontal: 16}}
          renderItem={() => (
            <SkeletonContent
              isLoading
              containerStyle={{width: '100%', height: 100}}
              animationDirection="horizontalRight"
              layout={[
                {
                  key: 'card',
                  width: '100%',
                  height: 100,
                },
              ]}
              boneColor="#222"
              highlightColor="#333333"
            />
          )}
        />
      </ScreenContainer>
    );
  }

  if (data?.result === 'error' || error) {
    console.error(data?.result === 'error' ? data.errors : error);
    return (
      <ScreenContainer title="Updates">
        <Banner title="Error">Could not fetch updates</Banner>
      </ScreenContainer>
    );
  }

  if (!data?.data) {
    return <ScreenContainer title="Updates"></ScreenContainer>;
  }

  return (
    <ScreenContainer title="Updates">
      <FlatList
        data={mangas}
        style={{marginBottom: 65}}
        ItemSeparatorComponent={() => <View style={{height: 16}} />}
        contentContainerStyle={{paddingHorizontal: 16}}
        refreshControl={
          <RefreshControl
            enabled
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({item: manga}) => {
          const matchingChapters = chapters
            .filter(
              chapter => findRelationship(chapter, 'manga')?.id === manga.id,
            )
            .sort((a, b) =>
              b.attributes.publishAt.localeCompare(a.attributes.publishAt),
            );

          return (
            <MangaChaptersPreview manga={manga} chapters={matchingChapters} />
          );
        }}
      />
    </ScreenContainer>
  );
}

function ScreenContainer({
  title,
  children,
}: PropsWithChildren<{title: string}>) {
  return (
    <View>
      <Title style={{padding: 16}}>{title}</Title>
      {children}
    </View>
  );
}
