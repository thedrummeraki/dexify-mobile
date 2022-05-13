import React, {useEffect, useState} from 'react';
import {Manga, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {CloseCurrentScreenHeader, MangaCollection} from 'src/components';
import {currentSeason} from 'src/utils';

export default function ShowAnimeSimulcastMangaList() {
  const [getMangaIds, {loading: loadingIds}] = useLazyGetRequest<string[]>(
    UrlBuilder.mangaIdsWithAiringAnime(),
  );
  const [getManga, {loading}] = useLazyGetRequest<PagedResultsList<Manga>>();

  const [manga, setManga] = useState<Manga[]>();
  const [ids, setIds] = useState<string[]>();

  useEffect(() => {
    getMangaIds().then(res => {
      if (res) {
        setIds(res);
      }
    });
  }, []);

  useEffect(() => {
    if (ids?.length) {
      getManga(
        UrlBuilder.mangaList({
          ids,
          limit: ids.length > 100 ? 100 : ids.length,
          order: {followedCount: 'desc'},
        }),
      ).then(res => {
        if (res?.result === 'ok') {
          setManga(res.data);
        }
      });
    }
  }, [ids]);

  return (
    <>
      <CloseCurrentScreenHeader
        title={`${currentSeason({capitalize: true})} anime simulcast`}
      />
      <MangaCollection loading={loadingIds || loading} manga={manga} />
    </>
  );
}
