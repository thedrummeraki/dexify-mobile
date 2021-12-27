import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Chapter, Manga} from 'src/api/mangadex/types';
import EncryptedStorage from 'react-native-encrypted-storage';

export namespace ReadingState {
  export interface Chapter {
    id: string;
    title: string;
    chapter: string;
    volume: string;
    mangaId: string;
    mangaName: string;
    coverUrl: string;
    imageUrl: string;
    currentPage: number;
    totalPageCount: number;
    when: Date;
  }

  export type RetrievedChapter = Omit<ReadingState.Chapter, 'when'> & {
    when: string;
  };
}

export interface ReadingState {
  chapters: ReadingState.Chapter[];
}

interface UpdateChapterFunctionArgs {
  page: number;
  totalPageCount: number;
  mangaName: string;
  chapter: Chapter;
  mangaId: string;
  imageUrl: string;
  coverUrl: string;
}

interface ReadingStateContextState {
  loading: boolean;
  readingState: ReadingState;
  updateChapter(args: UpdateChapterFunctionArgs): void;
}

const defaultReadingState: ReadingState = {chapters: []};

export const ReadingStateContext =
  React.createContext<ReadingStateContextState>({
    loading: false,
    readingState: defaultReadingState,
    updateChapter: () => console.log('{NOOP} updateChapter'),
  });

export function useReadingStateContext() {
  return useContext(ReadingStateContext);
}

export function useContinueReadingChapter() {
  const chapters = useContinueReadingChaptersList();

  if (chapters.length === 0) {
    return null;
  }

  return chapters[0];
}

export function useChapterProgress(chapterId: string) {
  const continueReadingChapters = useContinueReadingChaptersList();
  const info = continueReadingChapters.find(chapter => chapter.id === chapterId)

  if (!info) {
    return null;
  }

  return info.currentPage / info.totalPageCount;
}

export function useContinueReadingChaptersList() {
  const {
    readingState: {chapters},
  } = useReadingStateContext();

  return chapters.sort((a, b) => b.when.getTime() - a.when.getTime());
}

export default function ReadingStateProvider({
  children,
}: PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<ReadingState.Chapter[]>([]);

  useEffect(() => {
    retrieveStoredReadingState()
      .then(readingState => {
        setChapters(readingState.chapters);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    storeReadingState({chapters});
  }, [chapters]);

  const updateChapter = useCallback((args: UpdateChapterFunctionArgs) => {
    const {
      chapter,
      coverUrl,
      mangaId,
      imageUrl,
      mangaName,
      page: currentPage,
      totalPageCount,
    } = args;

    const title = chapter.attributes.title;

    setChapters(currentChapters => {
      const currentIds = currentChapters.map(x => x.id);
      if (!currentIds.includes(chapter.id)) {
        return [
          ...currentChapters,
          {
            id: chapter.id,
            coverUrl,
            imageUrl,
            mangaId,
            currentPage,
            totalPageCount,
            title,
            mangaName,
            volume: chapter.attributes.volume || '',
            chapter: chapter.attributes.chapter || '',
            when: new Date(),
          },
        ];
      } else {
        const withoutCurrentChapter = currentChapters.filter(
          x => x.id !== chapter.id,
        );
        return [
          ...withoutCurrentChapter,
          {
            id: chapter.id,
            coverUrl,
            imageUrl,
            mangaId,
            currentPage,
            totalPageCount,
            title,
            mangaName,
            volume: chapter.attributes.volume || '',
            chapter: chapter.attributes.chapter || '',
            when: new Date(),
          },
        ];
      }
    });
  }, []);

  return (
    <ReadingStateContext.Provider
      value={{loading, readingState: {chapters}, updateChapter}}>
      {children}
    </ReadingStateContext.Provider>
  );
}

async function storeReadingState(readingState: ReadingState) {
  try {
    const data = JSON.stringify(readingState);
    await EncryptedStorage.setItem('reading_state', data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function retrieveStoredReadingState(): Promise<ReadingState> {
  try {
    const retrieved = await EncryptedStorage.getItem('reading_state');
    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      const retrievedChapters = parsed.chapters
        ? (parsed.chapters as ReadingState.RetrievedChapter[])
        : [];

      return {
        chapters: retrievedChapters.map(
          (chapter: ReadingState.RetrievedChapter) => {
            return {
              ...chapter,
              when: new Date(Date.parse(chapter.when)),
            };
          },
        ),
      };
    }
    return defaultReadingState;
  } catch (error) {
    console.error(error);
    return defaultReadingState;
  }
}
