import React, {useEffect, useState} from 'react';
import {Manga} from 'src/api/mangadex/types';
import {GeneralHomeSection} from '../components';
import {useNewlyReleasedTitles} from '../hooks';

export default function NewTitles() {
  const {data, loading} = useNewlyReleasedTitles();
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
        title: 'Recently added',
        type: 'general',
      }}
    />
  );
}
