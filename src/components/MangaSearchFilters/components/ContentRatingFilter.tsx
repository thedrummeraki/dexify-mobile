import React from 'react';
import {Chip} from 'react-native-paper';
import {ContentRating} from 'src/api/mangadex/types';
import {useFiltersContext} from '../MangaSearchFilter';
import {BasicSection} from './BasicSection';

interface Props {
  visibleContentRatings?: ContentRating[];
}

// export function ContentRatingFilter({
//   visibleContentRatings = [
//     ContentRating.safe,
//     ContentRating.suggestive,
//     ContentRating.erotica,
//   ],
// }: Props) {
//   const {fields, submit} = useFiltersContext();

//   return (
//     <FilterButton
//       name="Content rating..."
//       values={visibleContentRatings}
//       currentValues={fields.contentRating.value}
//       onApply={submit}
//       onDismiss={fields.contentRating.reset}
//       onSelectionChange={fields.contentRating.onChange}
//     />
//   );
// }

export function ContentRatingFilter({
  visibleContentRatings = [
    ContentRating.safe,
    ContentRating.suggestive,
    ContentRating.erotica,
  ],
}: Props) {
  const {fields} = useFiltersContext();

  return (
    <BasicSection
      title="Content rating"
      values={visibleContentRatings}
      field={fields.contentRating}
    />
  );
}
