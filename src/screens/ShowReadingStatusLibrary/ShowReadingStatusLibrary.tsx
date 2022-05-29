import React, {useState} from 'react';
import {readingStatusInfo} from 'src/api';
import {
  CloseCurrentScreenHeader,
  MangaSearchCollection,
  MangaSearchFilters,
} from 'src/components';
import {MangaCollectionDisplay} from 'src/components/MangaSearchCollection/MangaSearchCollection';
import {useShowReadingStatusLibraryRoute} from 'src/foundation';
import {useLibraryMangaIds, useSettings} from 'src/prodivers';
import {ContentRating, MangaRequestParams} from 'src/api/mangadex/types';
import {Field} from '@shopify/react-form';
import {
  ContentRatingFilter,
  TagsFilter,
  RenderContext,
  PreviewFilters,
} from 'src/components/MangaSearchFilters';
import {PublicationStatusFitler} from 'src/components/MangaSearchFilters/components/PublicationStatusFilter';
import {PublicationDemographicFilter} from 'src/components/MangaSearchFilters/components/PublicationDemographicFilter';

export default function ShowReadingStatusLibrary() {
  const {
    params: {readingStatus},
  } = useShowReadingStatusLibraryRoute();
  const ids = useLibraryMangaIds(readingStatus) || undefined;

  const {contentRatings} = useSettings();

  const [filters, setFilters] = useState<MangaRequestParams>({
    ids,
    contentRating: contentRatings,
  });

  return (
    <>
      <CloseCurrentScreenHeader
        title={readingStatusInfo(readingStatus).content}
      />
      <MangaSearchFilters filters={filters} onFiltersChange={setFilters}>
        <RenderContext mode="modal">
          <ContentRatingFilter
            visibleContentRatings={Object.values(ContentRating)}
          />
          <PublicationStatusFitler />
          <PublicationDemographicFilter />
          <TagsFilter />
        </RenderContext>
        <RenderContext mode="scroll">
          <PreviewFilters />
        </RenderContext>
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
