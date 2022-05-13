import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {preferredTitle, readingStatusInfo} from 'src/api';
import {
  CloseCurrentScreenHeader,
  FullScreenModal,
  MangaSearchCollection,
  MangaSearchFilters,
  TextBadge,
} from 'src/components';
import {MangaCollectionDisplay} from 'src/components/MangaSearchCollection/MangaSearchCollection';
import {useShowReadingStatusLibraryRoute} from 'src/foundation';
import {useLibraryMangaIds} from 'src/prodivers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Manga,
  MangaRequestParams,
  MangaStatus,
  PagedResultsList,
  PublicationDemographic,
  TagMode,
} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {
  useForm,
  useField,
  Field,
  Form,
  FieldBag,
  FormMapping,
} from '@shopify/react-form';

type AllowedMangaRequestParams = Required<
  Pick<
    MangaRequestParams,
    | 'includedTags'
    | 'status'
    | 'publicationDemographic'
    | 'excludedTags'
    | 'order'
  >
>;

// type FiltersFieldBag = {
//   includedTags: Field<string[]>;
//   status: Field<MangaStatus[]>;
// };

type FiltersFieldBag<T> = {
  [K in keyof T]: Field<T[K]>;
};

export default function ShowReadingStatusLibrary() {
  const {
    params: {readingStatus},
  } = useShowReadingStatusLibraryRoute();
  const ids = useLibraryMangaIds(readingStatus) || undefined;

  // const [options, setOptions] = useState<MangaRequestParams>({
  //   includedTags: [],
  //   includedTagsMode: TagMode.AND,
  //   excludedTags: [],
  //   excludedTagsMode: TagMode.OR,
  //   status: [],
  //   originalLanguage: [],
  //   excludedOriginalLanguage: [],
  //   availableTranslatedLanguage: [],
  //   publicationDemographic: [],
  //   contentRating: [],
  //   order: {
  //     createdAt: 'asc',
  //     followedCount: 'desc',
  //     relevance: 'asc',
  //     updatedAt: 'asc',
  //   },
  // })

  const [params, setParams] = useState<MangaRequestParams>({ids});

  return (
    <>
      <CloseCurrentScreenHeader
        title={readingStatusInfo(readingStatus).content}
      />
      <MangaSearchFilters
        keys={['includedTags', 'status']}
        onFiltersApply={setParams}
      />
      {ids?.length ? (
        <MangaSearchCollection
          showEverything
          options={params}
          display={MangaCollectionDisplay.List}
        />
      ) : null}
    </>
  );
}

type Test = {
  a: string[];
  b: string;
  c: number;
  d: number[];
};

type T0 = NonNullable<null | undefined | string>;

// ✅ Remove nullable types from the type's keys
type WithoutNullableKeys<Type> = {
  [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
};

type Employee = {
  country?: string | null;
  salary?: number | null;
};

// 👇️ type T1 = {
//     name: string;
//     country: string;
//     salary: number;
//    }

type ArraysOnly<T, U = any> = T extends Array<U>
  ? T
  : T extends U[]
  ? U
  : never;

type JustMethodKeys<T> = {
  [Key in keyof T]: T[Key] extends Function ? Key : never;
}[keyof T];
type JustMethods<T> = keyof Pick<T, JustMethodKeys<T>>;

type WithoutNever<T> = Omit<T, JustMethods<T>>;

type PickArraysOnly<T> = WithoutNever<{
  [P in keyof T]-?: ArraysOnly<T[P]>;
}>;
type TestWithArraysOnly = PickArraysOnly<MangaRequestParams>;

function Filters<
  T extends Partial<PickArraysOnly<MangaRequestParams>>,
  K extends keyof T,
>({
  keys,
  fields,
  onChange,
}: {
  keys: Array<K>;
  fields: FiltersFieldBag<T>;
  onChange(value: Pick<T, K>): void;
}) {
  return (
    <ScrollView horizontal style={{margin: 0}}>
      {keys.map(key => {
        return (
          <FilterButton
            key={String(key)}
            values={fields.artists?.value || []}
            currentValues={[]}
            name="Status"
            icon="chevron-down"
            getName={item => item}
            onApply={value => {}}
            onDismiss={() => {}}
          />
        );
      })}
    </ScrollView>
  );
}

// function SearchFilters({
//   includedTags,
//   status,
//   onApply,
// }: {
//   includedTags: FiltersFieldBag['includedTags'];
//   status: FiltersFieldBag['status'];
//   onApply(): void;
// }) {
//   const {data: tagsData, loading: tagsLoading} = useGetRequest<
//     PagedResultsList<Manga.Tag>
//   >('https://api.mangadex.org/manga/tag');

//   // show disabled filters when loading
//   if (tagsLoading) {
//     return null;
//   }

//   return (
//     <ScrollView horizontal style={{margin: 0}}>
//       {/* <IconButton icon="filter-variant" onPress={() => {}} /> */}
//       {/* <View
//         style={{
//           flex: 0,
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginHorizontal: 15,
//           marginBottom: 10,
//         }}> */}
//       <FilterButton
//         values={Object.values(MangaStatus)}
//         currentValues={status.value}
//         name="Status"
//         icon="chevron-down"
//         getName={item => item}
//         onApply={value => {
//           status.onChange(value);
//           onApply();
//         }}
//         onDismiss={() => status.reset()}
//       />
//       {tagsData?.result === 'ok' ? (
//         <FilterButton
//           values={tagsData.data}
//           currentValues={tagsData.data.filter(tag =>
//             includedTags.value.includes(tag.id),
//           )}
//           name="With tags"
//           icon="chevron-down"
//           getName={item => preferredTitle(item.attributes.name)}
//           compare={(a, b) => (a.id === b.id ? 0 : -1)}
//           onApply={tags => {
//             includedTags.onChange(tags.map(tag => tag.id));
//             onApply();
//           }}
//           onDismiss={() => includedTags.reset()}
//         />
//       ) : null}

//       {/* </View> */}
//     </ScrollView>
//   );
// }

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

function paramsFromForm<T>(
  ids: string[] | undefined,
  fields: FormMapping<FiltersFieldBag<T>, 'value'>,
): Partial<MangaRequestParams> {
  return {
    ids,
    limit: ids?.length,
    ...fields,
  };
}
