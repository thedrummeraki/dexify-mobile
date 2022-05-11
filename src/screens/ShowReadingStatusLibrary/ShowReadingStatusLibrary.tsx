import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, TouchableNativeFeedback, View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {preferredTitle, readingStatusInfo} from 'src/api';
import {
  CloseCurrentScreenHeader,
  FullScreenModal,
  MangaSearchCollection,
  TextBadge,
} from 'src/components';
import {MangaCollectionDisplay} from 'src/components/MangaSearchCollection/MangaSearchCollection';
import {useShowReadingStatusLibraryRoute} from 'src/foundation';
import {useLibraryMangaIds} from 'src/prodivers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Manga,
  MangaOrder,
  MangaRequestParams,
  PagedResultsList,
  TagMode,
} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';

type AllowedMangaRequestParams = Omit<MangaRequestParams, 'title' | 'order'>;

export default function ShowReadingStatusLibrary() {
  const {
    params: {readingStatus},
  } = useShowReadingStatusLibraryRoute();
  const ids = useLibraryMangaIds(readingStatus);

  const [options, setOptions] = useState<MangaRequestParams>({
    includedTags: [],
    includedTagsMode: TagMode.AND,
    excludedTags: [],
    excludedTagsMode: TagMode.OR,
    status: [],
    originalLanguage: [],
    excludedOriginalLanguage: [],
    availableTranslatedLanguage: [],
    publicationDemographic: [],
    contentRating: [],
    order: {
      createdAt: 'asc',
      followedCount: 'desc',
      relevance: 'asc',
      updatedAt: 'asc',
    },
  });

  return (
    <>
      <CloseCurrentScreenHeader
        title={readingStatusInfo(readingStatus).content}
      />
      <SearchFilters options={options} onChange={setOptions} />
      {ids?.length ? (
        <MangaSearchCollection
          showEverything
          options={{ids, limit: ids.length, ...options}}
          display={MangaCollectionDisplay.List}
        />
      ) : null}
    </>
  );
}

function SearchFilters({
  options,
  onChange,
}: {
  options: MangaRequestParams;
  onChange(options: (options: MangaRequestParams) => MangaRequestParams): void;
}) {
  const {data: tagsData, loading: tagsLoading} = useGetRequest<
    PagedResultsList<Manga.Tag>
  >('https://api.mangadex.org/manga/tag');

  const [selectedOptions, setSelectedOptions] = useState(options);
  const handleDismiss = (key: keyof MangaRequestParams) => {
    setSelectedOptions(current => ({...current, [key]: options[key]}));
  };

  // show disabled filters when loading
  if (tagsLoading) {
    return null;
  }

  return (
    <View
      style={{
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
      }}>
      {/* <IconButton icon="filter-variant" onPress={() => {}} /> */}
      <FilterButton
        values={[
          {a: 1, b: 'one'},
          {a: 2, b: 'two'},
        ]}
        currentValues={[]}
        name="Sort by..."
        icon="chevron-down"
        getName={item => item.b}
        compare={(a, b) => (a.a === b.a ? 0 : -1)}
        onApply={console.log}
        onDismiss={() => handleDismiss('order')}
      />
      {tagsData?.result === 'ok' ? (
        <FilterButton
          values={tagsData.data}
          currentValues={tagsData.data.filter(tag =>
            selectedOptions.includedTags?.includes(tag.id),
          )}
          name="With tags"
          icon="chevron-down"
          getName={item => preferredTitle(item.attributes.name)}
          compare={(a, b) => (a.id === b.id ? 0 : -1)}
          onApply={tags =>
            onChange(current => ({
              ...current,
              includedTags: tags.map(tag => tag.id),
            }))
          }
          onDismiss={() => handleDismiss('includedTags')}
        />
      ) : null}
    </View>
  );
}

function FilterButton<T>({
  values,
  currentValues,
  multiple,
  name,
  icon,
  getName,
  compare,
  onApply,
  onDismiss,
}: {
  values: T[];
  currentValues: T[];
  name: string;
  multiple?: boolean;
  icon?: string;
  getName?: (value: T) => string;
  compare?: (a: T, b: T) => number;
  onApply: (values: T[]) => void;
  onDismiss: () => void;
}) {
  const {
    colors: {surface: background},
  } = useTheme();
  const [visible, setVisible] = useState(false);
  const handleDismiss = useCallback(() => {
    onDismiss();
    setVisible(false);
  }, []);

  const handleApply = useCallback((values: T[]) => {
    onApply(values);
    setVisible(false);
  }, []);

  const [selectedValues, setSelectedValue] = useState<T[]>(currentValues);

  const itemSelected = useCallback(
    (item: T) => {
      if (compare) {
        return selectedValues.filter(x => compare(item, x) === 0).length > 0;
      } else {
        return selectedValues.includes(item);
      }
    },
    [selectedValues, compare],
  );

  return (
    <TouchableNativeFeedback onPress={() => setVisible(true)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: background,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 50,
        }}>
        <Text>{name}</Text>
        {icon ? (
          <Icon
            name={icon}
            style={{fontSize: 18, color: '#fff', marginLeft: 5}}
          />
        ) : null}
        <FullScreenModal
          visible={visible}
          title={name}
          onDismiss={handleDismiss}
          primaryAction={{
            content: 'Apply',
            onAction: () => handleApply(selectedValues),
          }}>
          <FlatList
            data={values}
            renderItem={({item}) => {
              const selected = itemSelected(item);

              return (
                <TouchableNativeFeedback
                  onPress={() => {
                    if (selected) {
                      setSelectedValue(current =>
                        current.filter(x => item !== x),
                      );
                    } else {
                      setSelectedValue(current => [...current, item]);
                    }
                  }}>
                  <View
                    style={{
                      padding: 15,
                    }}>
                    <TextBadge
                      style={{marginLeft: -5}}
                      icon={selected ? 'check' : undefined}
                      content={<Text>{getName?.(item) || String(item)}</Text>}
                      background="none"
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            }}
          />
        </FullScreenModal>
      </View>
    </TouchableNativeFeedback>
  );
}
