import React from 'react';
import {Chip} from 'react-native-paper';
import {PublicationDemographic} from 'src/api/mangadex/types';
import {useFiltersContext} from '../MangaSearchFilter';
import {BasicSection} from './BasicSection';

export function PublicationDemographicFilter() {
  const {fields} = useFiltersContext();

  return (
    <BasicSection
      title="Demographic"
      values={Object.values(PublicationDemographic)}
      field={fields.publicationDemographic}
      getName={publicationDemographicName}
    />
  );
}

export function publicationDemographicName(
  publicationDemographic: PublicationDemographic,
) {
  switch (publicationDemographic) {
    case PublicationDemographic.josei:
      return 'Josei';
    case PublicationDemographic.seinen:
      return 'Seinen';
    case PublicationDemographic.shoujo:
      return 'Shoujo';
    case PublicationDemographic.shonen:
      return 'Shounen';
    case PublicationDemographic.none:
      return 'No demographic';
  }
}
