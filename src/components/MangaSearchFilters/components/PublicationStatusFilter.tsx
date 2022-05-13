import React from 'react';
import {Chip} from 'react-native-paper';
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
    />
  );
}
