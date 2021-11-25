import {Order} from '.';
import {ContentRating, MangaStatus, PublicationDemographic, TagMode} from '..';

export type MangaRequestParams = Partial<{
  title: string;
  artists: string[];
  authors: string[];
  ids: string[];
  year: number;
  includedTags: string[];
  includedTagsMode: TagMode[];
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
