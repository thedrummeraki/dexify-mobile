import React, {ComponentProps, useEffect, useState} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {Manga, MangaRequestParams} from 'src/api/mangadex/types';
import {useDebouncedValue} from 'src/utils';
import BasicList from '../BasicList';
import MangaCollection from '../MangaCollection';

export enum MangaCollectionDisplay {
  List,
  Images,
}

interface FilterOptions {
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  vertical?: boolean;
}

type Props = {
  options?: MangaRequestParams;
  showEverything?: boolean;
  timeout?: number;
  filterOptions?: FilterOptions;
  onMangaReady?(manga: Manga[]): void;
} & ComponentProps<typeof MangaCollection>;

export default function MangaSearchCollection({
  options,
  showEverything,
  timeout,
  onMangaReady,
  ...otherProps
}: Props) {
  const debouncedOptions = useDebouncedValue(options, timeout);
  const [get, {loading, data}] = useLazyGetMangaList(undefined, showEverything);

  useEffect(() => {
    get(debouncedOptions);
  }, [debouncedOptions]);

  const manga = data?.result === 'ok' ? data.data : [];

  useEffect(() => {
    if (manga.length) {
      onMangaReady?.(manga);
    }
  }, [manga]);

  return (
    <MangaCollection
      loading={loading}
      manga={data?.result === 'ok' ? data.data : undefined}
      {...otherProps}
    />
  );
}
