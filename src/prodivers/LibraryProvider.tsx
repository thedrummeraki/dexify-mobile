import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  AllReadingStatusResponse,
  Manga,
  CustomList,
  PagedResultsList,
  ReadingStatus,
  ReadingStatusUpdateResponse,
  BasicResultsResponse,
  EntityResponse,
} from 'src/api/mangadex/types';
import {
  useAuthenticatedLazyGetRequest,
  useAuthenticatedPostRequest,
  useAuthenticatedPutRequest,
} from 'src/api/utils';
import {useSession, useUpdatedSession} from '.';

interface LibraryState {
  loading: boolean;
  readingStatus: AllReadingStatusResponse;
  refreshReadingStatuses(): Promise<AllReadingStatusResponse | undefined>;
  updateMangaReadingStatus(
    id: string,
    status: ReadingStatus | null,
  ): Promise<ReadingStatusUpdateResponse | undefined>;
  refreshCustomLists(): Promise<PagedResultsList<CustomList> | undefined>;
  createCustomList(
    options: CustomList.CreateParams,
  ): Promise<EntityResponse<CustomList> | undefined>;
  updateCustomList(
    customList: CustomList,
    options: CustomList.UpdateParams,
  ): Promise<EntityResponse<CustomList> | undefined>;
  addMangaToCustomList(
    id: string,
    manga: string,
  ): Promise<BasicResultsResponse | undefined>;
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

export function useMangaIds(manga: string | Manga, status: ReadingStatus) {
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
  const {readingStatus: data} = useLibraryContext();

  if (!data?.statuses) {
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
  const {refreshToken} = useUpdatedSession();

  // Reading status (followed manga)
  const [
    getReadingStatus,
    {data: readingStatus, loading: readingStatusLoading},
  ] = useAuthenticatedLazyGetRequest<AllReadingStatusResponse>(
    'https://api.mangadex.org/manga/status',
  );

  const [postReadingStatus, {loading: updating}] =
    useAuthenticatedPostRequest<ReadingStatusUpdateResponse>();

  // Custom lists (library)
  const [postCreateCustomList] =
    useAuthenticatedPostRequest<EntityResponse<CustomList>>();
  const [putUpdateCustomList] =
    useAuthenticatedPutRequest<EntityResponse<CustomList>>();
  const [postAddMangaToCustomList] =
    useAuthenticatedPostRequest<BasicResultsResponse>();

  const loading = readingStatusLoading;

  useEffect(() => {
    if (session) {
      getReadingStatus().catch(error => {
        console.error('could not get reading status', error);
      });
    }
  }, [session]);

  const updateMangaReadingStatus = useCallback(
    async (id: string, status: ReadingStatus) => {
      try {
        const authResponse = await refreshToken();
        if (authResponse && authResponse.result !== 'ok') {
          console.warn(
            'could not refresh session token:',
            JSON.stringify(authResponse),
          );
          return;
        }

        return await postReadingStatus(
          `https://api.mangadex.org/manga/${id}/status`,
          {
            status,
          },
        );
      } catch (error) {
        console.error('could not update manga reading status', error);
      }
    },
    [session],
  );

  const createCustomList = useCallback(
    async (options: CustomList.CreateParams) => {
      try {
        const authResponse = await refreshToken();
        if (authResponse && authResponse.result !== 'ok') {
          console.warn(
            'could not refresh session token:',
            JSON.stringify(authResponse),
          );
          return;
        }

        return await postCreateCustomList('https://api.mangadex.org/list', {
          ...options,
          version: 1,
        });
      } catch (error) {
        console.error('create custom list', error);
      }
    },
    [session],
  );

  const addMangaToCustomList = useCallback(
    async (id: string, manga: string) => {
      try {
        return await postAddMangaToCustomList(
          `https://api.mangadex.org/manga/${manga}/list/${id}`,
        );
      } catch (error) {
        console.error('create custom list', error);
      }
    },
    [session],
  );

  const updateCustomList = useCallback(
    async (customList: CustomList, params: CustomList.UpdateParams) => {
      const id = customList.id;
      const version = customList.attributes.version;

      try {
        return await putUpdateCustomList(
          `https://api.mangadex.org/list/${id}`,
          {...params, version},
        );
      } catch (error) {
        console.error('update custom list', error);
      }
    },
    [session],
  );

  return (
    <LibraryContext.Provider
      value={{
        loading: loading || updating,
        readingStatus,
        refreshReadingStatuses: getReadingStatus,
        updateMangaReadingStatus,
        createCustomList,
        addMangaToCustomList,
        updateCustomList,
      }}>
      {children}
    </LibraryContext.Provider>
  );
}
