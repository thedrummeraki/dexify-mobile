import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {useGetMangaList} from 'src/api/mangadex/hooks';
import {
  Artist,
  Author,
  ContentRating,
  EntityResponse,
  Manga,
  PagedResultsList,
} from 'src/api/mangadex/types';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {useShowArtistRoute} from 'src/foundation';
import ShowArtistDetails from './ShowArtistDetails';

export default function ShowArtist() {
  const {
    params: {id, allowHentai},
  } = useShowArtistRoute();
  const {data: artistData, loading: loadingArtists} = useGetRequest<
    EntityResponse<Author | Artist>
  >(`https://api.mangadex.org/author/${id}`);

  const contentRatings = [
    ContentRating.safe,
    ContentRating.suggestive,
    ContentRating.erotica,
  ];
  if (allowHentai) {
    contentRatings.push(ContentRating.pornographic);
  }

  const {data: mangaData, loading: loadingManga} = useGetMangaList({
    authors: [id],
    contentRating: contentRatings,
  });

  const loading = loadingArtists || loadingManga;

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (artistData?.result === 'ok' || mangaData?.result === 'ok') {
    return (
      <ShowArtistDetails
        author={artistData?.result === 'ok' ? artistData?.data : undefined}
        manga={mangaData?.result === 'ok' ? mangaData?.data : undefined}
      />
    );
  }

  return null;
}
