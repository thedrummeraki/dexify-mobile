import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Dimensions, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ActivityIndicator, Text, TextInput} from 'react-native-paper';
import {findRelationships} from 'src/api';
import {useGetMangaList, useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {
  Artist,
  Author,
  Manga,
  MangaRequestParams,
} from 'src/api/mangadex/types';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {useDebouncedValue} from 'src/utils';
import {HiddenMangaBanner} from '..';
import BasicList from '../BasicList';
import MangaThumbnail from '../MangaThumbnail';
import {MangaListItem} from './MangaListItem';

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
  timeout?: number;
  filterOptions?: FilterOptions;
  display?: MangaCollectionDisplay;
  onMangaReady?(manga: Manga[]): void;
} & Pick<
  ComponentProps<typeof BasicList>,
  'HeaderComponent' | 'HeaderComponentStyle'
>;

export default function MangaSearchCollection({
  options,
  timeout,
  filterOptions,
  display = MangaCollectionDisplay.Images,
  HeaderComponent,
  HeaderComponentStyle,
  onMangaReady,
}: Props) {
  const [filterQuery, setFilterQuery] = useState('');
  const [filteredManga, setFilteredManga] = useState<Manga[]>([]);

  const debouncedOptions = useDebouncedValue(options, timeout);
  const [get, {loading, data}] = useLazyGetMangaList();

  useEffect(() => {
    get(debouncedOptions);
  }, [debouncedOptions]);

  const manga = data?.result === 'ok' ? data.data : [];

  useEffect(() => {
    if (manga.length) {
      filterManga(manga, filterQuery).then(setFilteredManga);
    }
  }, [manga, filterQuery]);

  useEffect(() => {
    if (manga.length) {
      onMangaReady?.(manga);
      console.log('manga ready...');
    }
  }, [manga]);

  const skeletonWidth = Dimensions.get('screen').width / 3 - 5 * 3;
  const showMissingTitlesBanner = data?.result === 'ok' && manga.length === 0;

  const headerMarkup =
    HeaderComponent || filterOptions || showMissingTitlesBanner ? (
      <>
        {HeaderComponent}
        {showMissingTitlesBanner && <HiddenMangaBanner />}
        {filterOptions && (
          <FilterTextInput
            {...filterOptions}
            onFilterQueryChange={setFilterQuery}
          />
        )}
      </>
    ) : undefined;

  const renderItem = useCallback(
    (manga: Manga) => {
      switch (display) {
        case MangaCollectionDisplay.List:
          return <MangaListItem manga={manga} />;
        case MangaCollectionDisplay.Images:
          return <MangaThumbnail showReadingStatus manga={manga} />;
        default:
          return null;
      }
    },
    [display],
  );

  return (
    <BasicList
      loading={loading}
      aspectRatio={display === MangaCollectionDisplay.Images ? 1 / 3 : 1}
      data={filterQuery ? filteredManga : manga}
      style={{marginHorizontal: 10}}
      itemStyle={{padding: 5}}
      renderItem={renderItem}
      skeletonLength={12}
      skeletonItem={<ThumbnailSkeleton height={160} width={skeletonWidth} />}
      HeaderComponent={headerMarkup}
      HeaderComponentStyle={HeaderComponentStyle}
      ListEmptyComponent={<Text>Empty!</Text>}
    />
  );
}

function FilterTextInput({
  placeholder,
  style,
  onFilterQueryChange,
}: FilterOptions & {
  onFilterQueryChange?(filterQuery: string): void;
}) {
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    onFilterQueryChange?.(filterQuery);
  }, [filterQuery, onFilterQueryChange]);

  return (
    <TextInput
      dense
      mode="flat"
      style={style}
      placeholder={placeholder || 'Filter manga...'}
      onChangeText={setFilterQuery}
    />
  );
}

export async function filterManga(manga: Manga[], query: string) {
  return manga.filter(item => {
    const titles = Object.values(item.attributes.title);
    const altTitles = Object.entries(item.attributes.altTitles).map(
      ([_, title]) => Object.values(title)[0],
    );
    const artistsNames = findRelationships<Artist>(item, 'artist').map(
      rel => rel.attributes.name,
    );
    const authorsNames = findRelationships<Author>(item, 'author').map(
      rel => rel.attributes.name,
    );

    const allTitles = titles
      .concat(altTitles)
      .concat(artistsNames)
      .concat(authorsNames)
      .map(title => title.toLocaleLowerCase());

    return allTitles.filter(title => title.includes(query)).length > 0;
  });
}
