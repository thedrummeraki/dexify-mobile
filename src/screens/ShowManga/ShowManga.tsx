import React from 'react';
import {useManga} from 'src/api/mangadex/hooks';
import {Authenticated} from 'src/components';
import {useShowMangaRoute} from 'src/foundation/Navigation';
import ShowMangaDetails from './ShowMangaDetails';
import ShowMangaDetailsSkeleton from './ShowMangaDetailsSkeleton';

export default function ShowManga() {
  const route = useShowMangaRoute();
  const manga = route.params;

  if (manga.attributes && manga.relationships) {
    return (
      <ShowMangaDetails
        manga={{
          type: 'manga',
          attributes: manga.attributes,
          relationships: manga.relationships,
          ...manga,
        }}
      />
    );
  }

  return <NotLoadedShowMangaDetails id={manga.id} />;
}

function NotLoadedShowMangaDetails({id}: {id: string}) {
  const {data, loading} = useManga(id, {
    includes: ['cover_art', 'author', 'artist', 'tag'],
  });

  if (loading) {
    return <ShowMangaDetailsSkeleton />;
  }

  if (data?.result === 'ok') {
    return <ShowMangaDetails manga={data.data} />;
  }

  return null;
}
