import React, {useEffect, useState} from 'react';
import {IconButton, useTheme} from 'react-native-paper';
import {BasicResultsResponse} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useDeleteRequest, useGetRequest, usePostRequest} from 'src/api/utils';
import {useIsLoggedIn} from 'src/prodivers';
import {useMangaDetails} from '../../../ShowMangaDetails';

export default function FollowMangaAction() {
  const {
    colors: {primary},
  } = useTheme();
  const loggedIn = useIsLoggedIn();
  const [following, setFollowing] = useState(false);

  const {manga} = useMangaDetails();
  const {data, loading} = useGetRequest<BasicResultsResponse>(
    UrlBuilder.buildUrl(`/user/follows/manga/${manga.id}`),
  );

  const [followManga] = usePostRequest<BasicResultsResponse>(
    UrlBuilder.buildUrl(`/manga/${manga.id}/follow`),
  );
  const [unfollowManga] = useDeleteRequest<BasicResultsResponse>(
    UrlBuilder.buildUrl(`/manga/${manga.id}/follow`),
  );

  useEffect(() => {
    setFollowing(data?.result === 'ok');
  }, [data]);

  if (loading || !loggedIn) {
    return <IconButton disabled icon="rss" />;
  }

  if (following) {
    return (
      <IconButton
        color={primary}
        icon="rss-box"
        onPress={() => {
          setFollowing(false);
          unfollowManga();
        }}
      />
    );
  }

  return (
    <IconButton
      icon="rss"
      onPress={() => {
        setFollowing(true);
        followManga();
      }}
    />
  );
}
