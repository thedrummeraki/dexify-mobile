import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  AllReadingStatusResponse,
  Manga,
  ReadingStatus,
  ReadingStatusUpdateResponse,
} from 'src/api/mangadex/types';
import {useLazyGetRequest, usePostRequest} from 'src/api/utils';
import {useSession} from '.';

interface LibraryState {
  loading: boolean;
  readingStatus: AllReadingStatusResponse;
  refreshReadingStatuses(): void;
  updateMangaReadingStatus(
    id: string,
    status: ReadingStatus,
  ): Promise<ReadingStatusUpdateResponse | undefined>;
}

export const LibraryContext = React.createContext<Partial<LibraryState>>({});

export function useLibraryContext() {
  return useContext(LibraryContext);
}

export function useLibraryStatus(manga: string | Manga) {
  let mangaId: string;
  if (typeof manga === 'string') {
    mangaId = manga;
  } else {
    mangaId = manga.id;
  }

  const {readingStatus} = useLibraryContext();
  const libraryStatus = readingStatus?.statuses[mangaId] || null;
  return libraryStatus || null;
}

export function useMangaIs(manga: string | Manga, status: ReadingStatus) {
  let mangaId: string;
  if (typeof manga === 'string') {
    mangaId = manga;
  } else {
    mangaId = manga.id;
  }

  const {readingStatus} = useLibraryContext();
  return readingStatus ? readingStatus.statuses[mangaId] === status : false;
}

export function useLibraryMangaIds(readingStatus?: ReadingStatus) {
  const {loading, readingStatus: data} = useLibraryContext();
  const ids: string[] = [];

  if (loading || !data?.statuses) {
    return null;
  }

  return Object.entries(data.statuses)
    .filter(([_, info]) =>
      readingStatus !== undefined ? info === readingStatus : true,
    )
    .map(([mangaId]) => mangaId);
}

export default function LibraryProvider({children}: PropsWithChildren<{}>) {
  const session = useSession();
  const [getReadingStatus, {data: readingStatus, loading, error}] =
    useLazyGetRequest<AllReadingStatusResponse>(
      'https://api.mangadex.org/manga/status',
    );

  console.log('ERROR', error);

  const [postReadingStatus, {loading: updating}] =
    usePostRequest<ReadingStatusUpdateResponse>();

  useEffect(() => {
    if (session) {
      getReadingStatus();
    }
  }, [session]);

  const updateMangaReadingStatus = useCallback(
    (id: string, status: ReadingStatus) => {
      return postReadingStatus(`https://api.mangadex.org/manga/${id}/status`, {
        status,
      });
    },
    [],
  );

  return (
    <LibraryContext.Provider
      value={{
        loading: loading || updating,
        readingStatus,
        refreshReadingStatuses: getReadingStatus,
        updateMangaReadingStatus,
      }}>
      {children}
    </LibraryContext.Provider>
  );
}
