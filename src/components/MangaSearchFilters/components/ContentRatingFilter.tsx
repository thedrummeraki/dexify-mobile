import React from 'react';
import {Chip} from 'react-native-paper';
import {ContentRating} from 'src/api/mangadex/types';
import {useSettings} from 'src/prodivers';
import {useFiltersContext} from '../MangaSearchFilter';
import {BasicSection} from './BasicSection';

interface Props {
  visibleContentRatings?: ContentRating[];
}

export function ContentRatingFilter({visibleContentRatings}: Props) {
  const {fields} = useFiltersContext();

  const {contentRatings} = useSettings();
  const values = visibleContentRatings || contentRatings;

  return (
    <BasicSection
      title="Content rating"
      values={values}
      field={fields.contentRating}
      getName={contentRatingName}
    />
  );
}

export function contentRatingName(contentRating: ContentRating) {
  switch (contentRating) {
    case ContentRating.safe:
      return 'For everyone';
    case ContentRating.suggestive:
      return 'For 13+ (suggestive)';
    case ContentRating.erotica:
      return 'For 15+ (erotica)';
    case ContentRating.pornographic:
      return 'For 18+ (hentai)';
  }
}
