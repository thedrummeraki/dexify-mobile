import React from 'react';
import {ReadingStatus} from 'src/api/mangadex/types';
import {useFiltersContext} from '../MangaSearchFilter';
import {BasicSection} from './BasicSection';

interface Props {
  visibleReadingStatus?: ReadingStatus[];
}

export function ReadingStatusFilter({visibleReadingStatus}: Props) {
  const {fields} = useFiltersContext();

  const readingStatuses = Object.values(ReadingStatus);
  const values = visibleReadingStatus || readingStatuses;

  return (
    <BasicSection
      title="Content rating"
      values={values}
      field={fields.readingStatus}
      getName={readingStatusName}
    />
  );
}

export function readingStatusName(readingStatus: ReadingStatus) {
  switch (readingStatus) {
    case ReadingStatus.Reading:
      return 'Reading';
    case ReadingStatus.Completed:
      return 'Completed';
    case ReadingStatus.Dropped:
      return 'Dropped';
    case ReadingStatus.OnHold:
      return 'On Hold';
    case ReadingStatus.PlanToRead:
      return 'Plan to Read';
    case ReadingStatus.ReReading:
      return 'Re-reading';
  }
}
