import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {Page} from '../types';
import {FlatList} from 'react-native-gesture-handler';
import {wait} from 'src/utils';

interface State {
  title: string;
  subtitle?: string;
  manga?: Manga;
  group?: string | null;
  locale?: string;
  currentPage: number;
  pages: Page[];
  flatListRef: React.MutableRefObject<FlatList<any> | null | undefined>;
  onPageChange(page: number): void;
}

interface Props {
  manga: Manga;
  title: string;
  locale?: string;
  subtitle?: string;
  pages: Page[];
  group?: string | null;
  initialPage: number;
}

export const ReaderContext = React.createContext<State>({
  title: '',
  currentPage: 1,
  pages: [],
  onPageChange: () => console.log('[onPageChange] {NOOP}'),
} as unknown as State);

export function useReaderContext() {
  return useContext(ReaderContext);
}

export default function ReaderProvider({
  children,
  manga,
  title,
  subtitle,
  group,
  locale,
  pages,
  initialPage,
}: PropsWithChildren<Props>) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const flatListRef = useRef<FlatList | null>();

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    wait(100).then(() => {
      flatListRef.current?.scrollToIndex({index: page - 1});
    });
  }, []);

  return (
    <ReaderContext.Provider
      value={{
        flatListRef,
        manga,
        currentPage,
        title,
        subtitle,
        pages,
        group,
        locale,
        onPageChange: handlePageChange,
      }}>
      {children}
    </ReaderContext.Provider>
  );
}
