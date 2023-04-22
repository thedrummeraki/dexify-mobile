import React from 'react';
import {MangaStatus} from 'src/api/mangadex/types';
import {useFiltersContext} from '../MangaSearchFilter';
import {BasicSection} from './BasicSection';

export function PublicationStatusFitler() {
  const {fields} = useFiltersContext();

  return (
    <BasicSection
      title="Publication status"
      values={Object.values(MangaStatus)}
      field={fields.status}
      getName={statusName}
    />
  );
}

export function statusName(status: MangaStatus) {
  switch (status) {
    case MangaStatus.ongoing:
      return 'Ongoing';
    case MangaStatus.completed:
      return 'Completed';
    case MangaStatus.hiatus:
      return 'Hiatus';
    case MangaStatus.cancelled:
      return 'Cancelled';
  }
}
