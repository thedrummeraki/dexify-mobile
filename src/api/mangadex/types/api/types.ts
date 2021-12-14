import {Order} from '.';
import {ContentRating, MangaStatus, PublicationDemographic, TagMode} from '..';

export type MangaRequestParams = Partial<{
  title: string;
  artists: string[];
  authors: string[];
  ids: string[];
  year: number;
  includedTags: string[];
  includedTagsMode: TagMode;
  excludedTags: string[];
  excludedTagsMode: TagMode[];
  status: MangaStatus[];
  originalLanguage: string[];
  excludedOriginalLanguage: string[];
  availableTranslatedLanguage: string[];
  publicationDemographic: PublicationDemographic[];
  createdAtSince: string;
  updatedAtSince: string;
  contentRating: ContentRating[];
  order: Order<'createdAt' | 'updatedAt' | 'followedCount' | 'relevance'>;
  includes: string[];
  hasAvailableChapters: '0' | '1' | 'true' | 'false';
  limit: number;
  offset: number;
}>;

export type SingleMangaRequestParams = Partial<{
  includes: string[];
}>;

export type ChapterRequestParams = Partial<{
  ids: string[];
  title: string;
  groups: string[];
  uploader: string;
  manga: string;
  volume: string | string[];
  chapter: string | string[];
  translatedLanguage: string[];
  originalLanguage: string[];
  excludedOriginalLanguage: string[];
  contentRating: ContentRating[];
  includeFutureUpdates: '0' | '1';
  createdAtSince: string;
  updatedAtSince: string;
  publishAtSince: string;
  order: Order<'createdAt' | 'updatedAt' | 'publishAt' | 'volume' | 'chapter'>;
  includes: string[];
  limit: number;
  offset: number;
}>;

export type CustomListRequestParams = Partial<{limit: number; offset: number}>;

export type ScanlationGroupRequestParams = Partial<{
  ids: string[];
  name: string;
  focusedLanguage: string;
  includes: string[];
  limit: number;
  offset: number;
  order: Order<
    | 'name'
    | 'createdAt'
    | 'updatedAt'
    | 'followedCount'
    | 'relevance'
    | 'latestUploadedChapter'
  >;
}>;

export type AuthorRequestParams = Partial<{
  ids: string[];
  name: string;
  includes: string[];
  limit: number;
  offset: number;
  order: Order<'name'>;
}>;
