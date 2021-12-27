import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {Artist, Author, EntityResponse} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowArtistRoute} from 'src/foundation';
import ShowArtistDetails from './ShowArtistDetails';

export default function ShowArtist() {
  const {
    params: {id},
  } = useShowArtistRoute();
  const {data: artistData, loading} = useGetRequest<
    EntityResponse<Author | Artist>
  >(`https://api.mangadex.org/author/${id}`);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (artistData?.result === 'ok') {
    return <ShowArtistDetails author={artistData.data} />;
  }

  return null;
}
