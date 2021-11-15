import React, {PropsWithChildren, useContext, useEffect, useMemo, useState} from 'react';
import {MangaSearchOptions} from 'src/api/mangadex/types';

type SearchOptions = Partial<MangaSearchOptions>;
interface SearchContextType {
  options: SearchOptions;
  setOptions: (options: SearchOptions) => void;
}

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

type SimpleSearchOptions = Omit<SearchOptions, keyof ComplexSearchOptionKeys>

interface SearchParamEntry {
  title: string; // what the user sees
  name: string; // query param name
  value: string; // query param value
  simple?: boolean;
}

export const SearchContext = React.createContext<SearchContextType>({} as SearchContextType);

export default function SearchProvider({children}: PropsWithChildren<{}>) {
  const [options, setOptions] = useState<SearchOptions>({});

  return <SearchContext.Provider value={{options, setOptions}}>
    {children}
  </SearchContext.Provider>
}

export function useSearch(options: SearchOptions) {
  const url = useMemo(() => {
    const paramEntries = optionToParams(options).concat(complexOptionsToParams(options));
    const urlParts = ['https://api.mangadex.org/manga'];

    const params = paramEntries.map(entry => `${entry.name}=${entry.value}`).join('&');
    if (params) {
      urlParts.push('?', params);
    }
    
    return urlParts.join('')
  }, [options]);

  return {options, url}
}

function optionToParams(options: SimpleSearchOptions): SearchParamEntry[] {
  const params: SearchParamEntry[] = [];

  Object.entries(options).forEach(([name, value]) => {
    if (!(name in options)) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(x => {
        params.push({title: x, value: x, name: x, simple: true});
      });
    } else if (value) {
      const stringValue = String(value);
      params.push({title: stringValue, name: stringValue, value: stringValue, simple: true})
    }
  })

  return params;
}

function complexOptionsToParams(complexOptions: ComplexSearchOptionKeys): SearchParamEntry[] {
  const params: SearchParamEntry[] = [];

  complexOptions.artists?.forEach(a => {
    params.push({title: a.attributes.name, name: 'artist[]', value: a.id});
  })
  complexOptions.authors?.forEach(a => {
    params.push({title: a.attributes.name, name: 'author[]', value: a.id});
  })
  complexOptions.contentRating?.forEach(cr => {
    params.push({title: cr, name: 'contentRating[]', value: cr});
  })
  complexOptions.excludedTags?.forEach(tag => {
    params.push({title: tag.attributes.name.en, name: 'excludedTags[]', value: tag.id});
  })
  complexOptions.includedTags?.forEach(tag => {
    params.push({title: tag.attributes.name.en, name: 'includedTags[]', value: tag.id});
  })
  complexOptions.publicationDemographic?.forEach(pd => {
    params.push({title: pd, name: 'publicationDemographic[]', value: pd})
  })
  if (complexOptions.order?.createdAt) {
    params.push({title: 'Created at', name: 'order[createdAt]', value: complexOptions.order?.createdAt});
  }
  if (complexOptions.order?.updatedAt) {
    params.push({title: 'Updated at', name: 'order[updatedAt]', value: complexOptions.order?.updatedAt});
  }

  return params;
}

function optionsToUrl(options: SearchOptions) {}
