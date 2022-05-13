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
  ContentRating,
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
import {
  ExcludedTagsFilter,
  IncludedTagsFilter,
  ContentRatingFilter,
  TagsFilter,
} from 'src/components/MangaSearchFilters';
import {PublicationStatusFitler} from 'src/components/MangaSearchFilters/components/PublicationStatusFilter';
import {PublicationDemographicFilter} from 'src/components/MangaSearchFilters/components/PublicationDemographicFilter';

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

  const [filters, setFilters] = useState<MangaRequestParams>({ids});

  return (
    <>
      <CloseCurrentScreenHeader
        title={readingStatusInfo(readingStatus).content}
      />
      {/* <MangaSearchFilters
        keys={['includedTags', 'status']}
        onFiltersApply={setParams}
      /> */}
      <MangaSearchFilters filters={filters} onFiltersChange={setFilters}>
        <ContentRatingFilter
          visibleContentRatings={Object.values(ContentRating)}
        />
        <PublicationStatusFitler />
        <PublicationDemographicFilter />
        <TagsFilter />
      </MangaSearchFilters>
      {ids?.length ? (
        <MangaSearchCollection
          showEverything
          options={{
            ids,
            limit: ids.length > 100 ? 100 : ids.length,
            ...filters,
          }}
          display={MangaCollectionDisplay.List}
        />
      ) : null}
    </>
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

// type Test = {
//   a: string[];
//   b: string;
//   c: number;
//   d: number[];
// };

// type T0 = NonNullable<null | undefined | string>;

// // ✅ Remove nullable types from the type's keys
// type WithoutNullableKeys<Type> = {
//   [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
// };

// type Employee = {
//   country?: string | null;
//   salary?: number | null;
// };

// // 👇️ type T1 = {
// //     name: string;
// //     country: string;
// //     salary: number;
// //    }

// type ArraysOnly<T, U = any> = T extends Array<U>
//   ? T
//   : T extends U[]
//   ? U
//   : never;

// type JustMethodKeys<T> = {
//   [Key in keyof T]: T[Key] extends Function ? Key : never;
// }[keyof T];
// type JustMethods<T> = keyof Pick<T, JustMethodKeys<T>>;

// type WithoutNever<T> = Omit<T, JustMethods<T>>;

// type PickArraysOnly<T> = WithoutNever<{
//   [P in keyof T]-?: ArraysOnly<T[P]>;
// }>;
// type TestWithArraysOnly = PickArraysOnly<MangaRequestParams>;
