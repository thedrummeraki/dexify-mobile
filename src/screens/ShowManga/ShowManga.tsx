import React from 'react';
import {Title} from 'react-native-paper';
import {EntityResponse, Manga} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowMangaRoute} from 'src/foundation/Navigation';
import ShowMangaDetails from './ShowMangaDetails';
import ShowMangaDetailsSkeleton from './ShowMangaDetailsSkeleton';

export default function ShowManga() {
  const route = useShowMangaRoute();
  const {data, error, loading} = useGetRequest<EntityResponse<Manga>>(
    `https://api.mangadex.org/manga/${route.params.id}?includes[]=cover_art&includes[]=author&includes[]=artist&includes[]=tag`,
  );

  if (loading) {
    return <ShowMangaDetailsSkeleton />;
  }

  if (data?.result === 'ok') {
    return <ShowMangaDetails manga={data.data} />;
  }

  return null;
}
