import React, {useState} from 'react';
import {MangaSearchOptions} from 'src/api/mangadex/types';

type SearchOptions = Partial<MangaSearchOptions>;

// this object is an object of objects. They need to show a title on the ui,
// and search by id on the "backend".
type ComplexSearchOptionKeys = Pick<
  SearchOptions,
  | 'artists'
  | 'authors'
  | 'contentRating'
  | 'excludedTags'
  | 'includedTags'
  | 'publicationDemographic'
  | 'status'
  | 'order'
>;

export default function SearchProvider() {
  const [options, setOptions] = useState<SearchOptions>({});
}

function optionsToUrl(options: SearchOptions) {}
