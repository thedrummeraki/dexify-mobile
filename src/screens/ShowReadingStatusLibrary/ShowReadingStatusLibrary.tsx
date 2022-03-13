import React, {useEffect, useState} from 'react';
import {readingStatusInfo} from 'src/api';
import {Manga, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {ResponseStatus, useLazyGetRequest} from 'src/api/utils';
import {
  CloseCurrentScreenHeader,
  MangaCollection,
  MangaSearchCollection,
} from 'src/components';
import {MangaCollectionDisplay} from 'src/components/MangaSearchCollection/MangaSearchCollection';
import {useShowReadingStatusLibraryRoute} from 'src/foundation';
import {useLibraryMangaIds} from 'src/prodivers';
import {currentSeason} from 'src/utils';

export default function ShowReadingStatusLibrary() {
  const {
    params: {readingStatus},
  } = useShowReadingStatusLibraryRoute();
  const ids = useLibraryMangaIds(readingStatus);

  return (
    <>
      <CloseCurrentScreenHeader
        title={readingStatusInfo(readingStatus).content}
      />
      {ids?.length ? (
        <MangaSearchCollection
          showEverything
          options={{ids, limit: ids.length}}
          display={MangaCollectionDisplay.List}
        />
      ) : null}
    </>
  );
}
