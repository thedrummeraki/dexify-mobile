import React, {ComponentProps, useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProps,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {findRelationships} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {useHeader} from 'src/prodivers';
import {List} from '../List/List';
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
  hasMoreManga?: boolean;
  numColumns?: number;
  skeletonLength?: number;
  title?: string;
  description?: string;
  loading?: boolean;
  display?: MangaCollectionDisplay;
  filterOptions?: FilterOptions;
}

type MangaThumbnailProps = Omit<
  ComponentProps<typeof MangaThumbnail>,
  'manga' | 'onPress'
>;

type Props = BasicProps &
  MangaThumbnailProps & {
    flatListProps?: Omit<FlatListProps<Manga>, 'data' | 'renderItem'>;
  };

export default function MangaCollection({
  manga,
  hasMoreManga,
  // title,
  // description,
  loading,
  display = MangaCollectionDisplay.Images,
  numColumns = 3,
  skeletonLength = 12,
  filterOptions,
  flatListProps,
}: Props) {
  useHeader({title: ' '});

  const [filterQuery, setFilterQuery] = useState('');
  const [filteredManga, setFilteredManga] = useState<Manga[]>([]);

  const skeletonWidth = Dimensions.get('screen').width / 3 - 5 * 3;

  const ListHeaderComponent = flatListProps?.ListHeaderComponent;

  const headerMarkup =
    ListHeaderComponent || filterOptions ? (
      <>
        {ListHeaderComponent}
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

  const skeletonItemMarkup =
    display === MangaCollectionDisplay.Images ? (
      <ThumbnailSkeleton height={160} width={skeletonWidth} />
    ) : (
      <List.Item.Skeleton imageWidth={70} />
    );

  const skeletonMarkup =
    loading && hasMoreManga ? (
      <FlatList
        numColumns={numColumns}
        style={{marginBottom: 40}}
        contentContainerStyle={{padding: 2}}
        data={Array.from({length: skeletonLength}).map((_, i) => i)}
        renderItem={() => skeletonItemMarkup}
        keyExtractor={item => `skeleton-${item}`}
      />
    ) : undefined;

  const renderItem = useCallback(
    (manga: Manga) => {
      switch (display) {
        case MangaCollectionDisplay.List:
          return <MangaListItem manga={manga} />;
        case MangaCollectionDisplay.Images:
          return (
            <View style={{flex: 1 / numColumns, padding: 2}}>
              <MangaThumbnail manga={manga} />
            </View>
          );
        default:
          return null;
      }
    },
    [display, numColumns],
  );

  return (
    <FlatList
      style={{marginBottom: 40}}
      contentContainerStyle={{padding: 2}}
      numColumns={numColumns}
      {...flatListProps}
      data={filterQuery ? filteredManga : manga || []}
      ListHeaderComponent={headerMarkup}
      ListFooterComponent={skeletonMarkup}
      renderItem={({item}) => {
        return renderItem(item);
      }}
    />
  );

  // return (
  //   <ScrollView>
  //     <BasicList
  //       loading={loading}
  //       aspectRatio={display === MangaCollectionDisplay.Images ? 1 / 3 : 1}
  //       data={filterQuery ? filteredManga : manga || []}
  //       style={{marginHorizontal: 10}}
  //       itemStyle={{padding: 5}}
  //       renderItem={renderItem}
  //       skeletonLength={12}
  //       skeletonItem={skeletonItemMarkup}
  //       ListHeaderComponent={headerMarkup}
  //       ListHeaderComponentStyle={ListHeaderComponentStyle}
  //       ListEmptyComponent={
  //         ListEmptyComponent || <Banner>No titles were found</Banner>
  //       }
  //     />
  //   </ScrollView>
  // );
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
