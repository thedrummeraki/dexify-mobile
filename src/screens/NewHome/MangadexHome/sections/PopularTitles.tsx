import React, {useEffect, useState} from 'react';
import {Manga} from 'src/api/mangadex/types';
import {GeneralHomeSection} from '../components';
import {usePopularManga} from '../hooks';

export default function PopularTitles() {
  const {data, loading} = usePopularManga({offset: 1, limit: 10});
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
        title: 'Popular titles',
        type: 'general',
      }}
    />
  );
}
