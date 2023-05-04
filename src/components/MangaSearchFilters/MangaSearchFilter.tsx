import {Field, Form, useField, useForm} from '@shopify/react-form';
import React, {useContext, useState} from 'react';
import {
  Manga,
  MangaRequestParams,
  PagedResultsList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useGetRequest} from 'src/api/utils';
import {notEmpty} from 'src/utils';
import {RenderContext} from './components';
import {RenderInModal} from './components/RenderInModal';
import {RenderInScrollView} from './components/RenderInScrollView';

type AllowedFilters = Exclude<
  keyof MangaRequestParams,
  'title' | 'limit' | 'offset' | 'ids' | 'includes'
>;

type Filters = Pick<MangaRequestParams, AllowedFilters>;

type FilterChild = React.ReactElement<{
  mode: 'modal' | 'scroll';
}>;

interface Props {
  // two children
  hideOpenModalIcon?: boolean;
  modalOpen?: boolean;
  children: FilterChild[] | FilterChild;
  filters: Filters;
  onFiltersChange(appliedFilters: Filters): void;
  onModalOpen?(open: boolean): void;
}

type FiltersFieldBag = {
  [key in AllowedFilters]-?: Field<Filters[key]>;
};

type FormState = Form<FiltersFieldBag>;

interface ContextState extends FormState {
  tags: Manga.Tag[];
  filtersPresent: boolean;
}

export const Context = React.createContext<ContextState | null>(null);

export default function MangaSearchFilters({
  modalOpen: modalOpenProp,
  hideOpenModalIcon,
  filters,
  children,
  onFiltersChange: onFiltersApply,
  onModalOpen: onModalOpenProp,
}: Props) {
  const {data} = useGetRequest<PagedResultsList<Manga.Tag>>(
    UrlBuilder.tagList(),
  );
  const tags = (data?.result === 'ok' && data.data) || [];

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = (open: boolean) => {
    if (onModalOpenProp) {
      onModalOpenProp(open);
    } else {
      setModalOpen(open);
    }
  };

  const form = useForm<FiltersFieldBag>({
    fields: {
      includedTags: useField(filters.includedTags),
      excludedTags: useField(filters.excludedTags),
      artists: useField(filters.artists),
      authors: useField(filters.authors),
      availableTranslatedLanguage: useField(
        filters.availableTranslatedLanguage,
      ),
      contentRating: useField(filters.contentRating),
      createdAtSince: useField(filters.createdAtSince),
      excludedOriginalLanguage: useField(filters.excludedOriginalLanguage),
      excludedTagsMode: useField(filters.excludedTagsMode),
      includedTagsMode: useField(filters.includedTagsMode),
      originalLanguage: useField(filters.artists),
      publicationDemographic: useField(filters.publicationDemographic),
      readingStatus: useField(filters.readingStatus),
      status: useField(filters.status),
      updatedAtSince: useField(filters.updatedAtSince),
      group: useField(filters.group),
      hasAvailableChapters: useField(filters.hasAvailableChapters),
      order: useField(filters.order),
      year: useField(filters.year),
    },
    onSubmit: async values => {
      const toSubmit = Object.fromEntries(
        Object.entries(values)
          .map(([key, value]) => {
            if (
              !value || // null or undefined
              (Array.isArray(value) && value.length === 0) || // empty array
              (typeof value === 'string' && value.length === 0) || // empty string
              (typeof value === 'object' && Object.entries(value).length === 0) // empty object
            ) {
              return [];
            }
            return [key, value];
          })
          .filter(notEmpty),
      );
      onFiltersApply(toSubmit);

      return {status: 'success'};
    },
  });

  const allChildren = Array.isArray(children) ? children : [children];

  const modalChildren = allChildren.filter(({props}) => props.mode === 'modal');
  const scrollChildren = allChildren.filter(
    ({props}) => props.mode === 'scroll',
  );

  const filtersPresent = form.dirty;

  return (
    <Context.Provider value={{tags, filtersPresent, ...form}}>
      <RenderInScrollView
        hideOpenModalIcon={hideOpenModalIcon}
        onModalOpen={() => handleModalOpen(true)}>
        {scrollChildren}
      </RenderInScrollView>
      <RenderInModal
        modalOpen={modalOpenProp || modalOpen}
        onModalOpen={handleModalOpen}>
        {modalChildren}
      </RenderInModal>
    </Context.Provider>
  );
}

export function useFiltersContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('This component must be used within <MangaSearchFilters>');
  }

  return context;
}

MangaSearchFilters.Render = RenderContext;
