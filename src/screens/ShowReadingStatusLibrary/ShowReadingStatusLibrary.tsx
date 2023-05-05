import React from 'react';
import {readingStatusInfo} from 'src/api';
import {CloseCurrentScreenHeader, MangaSearchCollection} from 'src/components';
import {MangaCollectionDisplay} from 'src/components/MangaSearchCollection/MangaSearchCollection';
import {useShowReadingStatusLibraryRoute} from 'src/foundation';
import {useLibraryMangaIds} from 'src/prodivers';

export default function ShowReadingStatusLibrary() {
  const {
    params: {readingStatus},
  } = useShowReadingStatusLibraryRoute();
  const ids = useLibraryMangaIds(readingStatus) || undefined;

  return (
    <>
      <CloseCurrentScreenHeader
        title={readingStatusInfo(readingStatus).content}
      />
      <MangaSearchCollection
        searchingById
        options={{ids}}
        showReadingStatus={false}
        flatListProps={{style: {paddingHorizontal: 8}}}
      />
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
