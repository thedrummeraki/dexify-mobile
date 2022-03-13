import React, {ComponentProps, useCallback, useEffect, useState} from 'react';
import {Dimensions, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Caption, TextInput, Title} from 'react-native-paper';
import {findRelationships} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {useHeader} from 'src/prodivers';
import Banner from '../Banner';
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

interface BasicProps {
  manga?: Manga[];
  title?: string;
  description?: string;
  loading?: boolean;
  display?: MangaCollectionDisplay;
  filterOptions?: FilterOptions;
}

type MangaThumbnailProps = Omit<
  React.ComponentProps<typeof MangaThumbnail>,
  'manga' | 'onPress'
>;

type Props = BasicProps &
  MangaThumbnailProps &
  Pick<
    ComponentProps<typeof BasicList>,
    'HeaderComponent' | 'HeaderComponentStyle' | 'ListEmptyComponent'
  >;

export default function MangaCollection({
  manga,
  title,
  description,
  loading,
  display = MangaCollectionDisplay.Images,
  filterOptions,
  HeaderComponent,
  HeaderComponentStyle,
  ListEmptyComponent,
  ...thumbnailProps
}: Props) {
  useHeader({title: ' '});

  const [filterQuery, setFilterQuery] = useState('');
  const [filteredManga, setFilteredManga] = useState<Manga[]>([]);

  const skeletonWidth = Dimensions.get('screen').width / 3 - 5 * 3;

  const headerMarkup =
    HeaderComponent || filterOptions ? (
      <>
        {HeaderComponent}
        {filterOptions && (
          <FilterTextInput
            {...filterOptions}
            onFilterQueryChange={setFilterQuery}
          />
        )}
      </>
    ) : undefined;

  useEffect(() => {
    if (manga?.length) {
      filterManga(manga, filterQuery).then(setFilteredManga);
    }
  }, [manga, filterQuery]);

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
    <ScrollView>
      <BasicList
        loading={loading}
        aspectRatio={display === MangaCollectionDisplay.Images ? 1 / 3 : 1}
        data={filterQuery ? filteredManga : manga || []}
        style={{marginHorizontal: 10}}
        itemStyle={{padding: 5}}
        renderItem={renderItem}
        skeletonLength={12}
        skeletonItem={<ThumbnailSkeleton height={160} width={skeletonWidth} />}
        HeaderComponent={headerMarkup}
        HeaderComponentStyle={HeaderComponentStyle}
        ListEmptyComponent={
          ListEmptyComponent || <Banner>No titles were found</Banner>
        }
      />
    </ScrollView>
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
