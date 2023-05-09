import React, {useEffect, useState} from 'react';
import {Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import {GeneralHomeSection} from '../components';
import {useSeasonalManga} from '../hooks';

export default function SeasonalManga() {
  const navigation = useDexifyNavigation();
  const {data, loading} = useSeasonalManga();
  const [manga, setManga] = useState<Manga[]>();

  useEffect(() => {
    if (data?.result === 'ok') {
      setManga(data.data);
    }
  }, [data]);

  return (
    <GeneralHomeSection
      section={{
        manga,
        loading,
        title: 'Spring 2023 anime simulcast',
        type: 'general',
        viewMore: () => {
          navigation.push('ShowAnimeSimulcastMangaList');
        },
      }}
    />
  );
}
