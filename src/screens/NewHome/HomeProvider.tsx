import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {useGetMangaList, useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {Chapter, Manga, ReadingStatus} from 'src/api/mangadex/types';
import {useLibraryMangaIds} from 'src/prodivers';

interface ProviderState {
  popularManga: Manga[]; // max 20
  checkTheseOut: Manga[]; // max 10
  airingNow: Manga[]; // max 10
  readingNow: Manga[]; // max 20
  randomManga: Manga;
  updates: Chapter[];
}

type InternalState = Partial<ProviderState>;
type State = InternalState & {loading: boolean};

export const HomeContext = React.createContext<State>({loading: false});

export default function HomeProvider({children}: PropsWithChildren<{}>) {
  const initialized = useRef({
    popularManga: false,
    checkTheseOut: false,
    airingNow: false,
    readingNow: false,
    randomManga: false,
  });
  const [state, setState] = useState<InternalState>({});
  const readingNowMangaIds = useLibraryMangaIds(ReadingStatus.Reading);

  const {data: popularMangaData, loading: popularMangaLoading} =
    useGetMangaList({order: {followedCount: 'desc'}});

  const loading = popularMangaLoading;

  const [getMangas] = useLazyGetMangaList();

  useEffect(() => {
    if (readingNowMangaIds && !initialized.current.readingNow) {
      initialized.current.readingNow = true;

      getMangas({ids: readingNowMangaIds}).then(response => {
        if (response?.result === 'ok') {
          setState(state => ({...state, readingNow: response.data}));
        }
      });
    }
  }, [getMangas, readingNowMangaIds]);

  useEffect(() => {
    if (
      popularMangaData?.result === 'ok' &&
      !initialized.current.popularManga
    ) {
      initialized.current.popularManga = true;
      setState(state => ({...state, popularManga: popularMangaData.data}));
    }
  }, [popularMangaData]);

  return (
    <HomeContext.Provider value={{...state, loading}}>
      {children}
    </HomeContext.Provider>
  );
}
