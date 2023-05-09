import React, {useEffect, useState} from 'react';
import {Manga} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {
  CloseCurrentScreenHeader,
  MangaCollection,
  MangaSearchCollection,
} from 'src/components';
import {currentSeason} from 'src/utils';

export default function ShowAnimeSimulcastMangaList() {
  const [getMangaIds] = useLazyGetRequest<string[]>(
    UrlBuilder.mangaIdsWithAiringAnime(),
  );

  const [ids, setIds] = useState<string[]>();

  useEffect(() => {
    getMangaIds().then(res => {
      if (res) {
        setIds(res);
      }
    });
  }, []);

  return (
    <>
      <CloseCurrentScreenHeader
        title={`${currentSeason({capitalize: true})} anime simulcast`}
      />
      <MangaSearchCollection searchingById options={{ids}} />
    </>
  );
}
