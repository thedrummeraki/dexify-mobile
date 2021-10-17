import React from 'react';
import {Text, Title} from 'react-native-paper';
import {EntityResponse, Manga} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowMangaRoute} from 'src/foundation/Navigation';
import ShowMangaDetails from './ShowMangaDetails';

export default function ShowManga() {
  const route = useShowMangaRoute();
  const {data, error, loading} = useGetRequest<EntityResponse<Manga>>(
    `https://api.mangadex.org/manga/${route.params.id}?includes[]=cover_art&includes[]=authors`,
  );

  if (loading) {
    return <Title>Loading...</Title>;
  }

  if (error || !data || data.result === 'error') {
    return <Title>Error while fetching manga info</Title>;
  }

  if (data.result === 'ok') {
    return <ShowMangaDetails mangaData={data} />;
  }

  return null;
}
