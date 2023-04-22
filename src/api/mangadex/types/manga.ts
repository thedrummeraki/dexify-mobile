import {CoverArt, ScanlationGroup} from '.';
import {BasicResultsResponse, MangadexError, Order, Relationship} from './api';
import {Author} from './author';
import {Maybe} from './utils';

export enum MangaStatus {
  ongoing = 'ongoing',
  completed = 'completed',
  hiatus = 'hiatus',
  cancelled = 'cancelled',
}

export enum PublicationDemographic {
  shonen = 'shounen',
  shoujo = 'shoujo',
  josei = 'josei',
  seinen = 'seinen',
  none = 'none',
}

export enum ContentRating {
  safe = 'safe',
  suggestive = 'suggestive',
  erotica = 'erotica',
  pornographic = 'pornographic',
}

export interface Manga {
  id: string;
  type: 'manga';
  attributes: MangaAttributes;
  relationships: Relationship<Author | ScanlationGroup | CoverArt | Manga>[];
}

export interface MangaAttributes {
  title: Title;
  altTitles: Array<Title>;
  description: Description;
  links?: Maybe<MangaLinks>;
  lastChapter?: Maybe<string>;
  publicationDemographic?: Maybe<PublicationDemographic>;
  status: MangaStatus;
  year?: Maybe<number>;
  contentRating: ContentRating;
  tags: Array<Manga.Tag>;
  originalLanguage: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  isLocked?: boolean;
  availableTranslatedLanguages: string[];
}

export type Title = {
  [key: string]: string;
};

export type Description = {
  [key: string]: string;
};

export namespace Manga {
  export interface Tag {
    id: string;
    type: 'tag';
    attributes: TagAttributes;
    relationships: Relationship[];
  }

  export interface TagAttributes {
    name: Title;
    version: number;
    group: string;
    description: any[];
  }

  interface VolumeAggregateDetailsChapter {
    chapter: string;
    others: string[];
    id: string;
    count: number;
  }

  interface VolumeAggregateDetails {
    volume: string;
    count: number;
    chapters: {[key: string]: VolumeAggregateDetailsChapter};
  }

  export interface VolumeAggregateInfo {
    [key: string]: VolumeAggregateDetails;
  }

  interface SuccessAggregate extends BasicResultsResponse {
    result: 'ok';
    volumes: VolumeAggregateInfo;
  }

  interface ErrorAggregate extends BasicResultsResponse {
    result: 'error';
  }

  export type Aggregate = SuccessAggregate | ErrorAggregate;

  export interface StatisticRating {
    average: number | null;
    distribution: {[rating: string]: string};
  }

  export interface Statistic {
    rating: StatisticRating;
    follows: number;
  }

  export interface Statistics {
    [mangaId: string]: Statistic;
  }

  interface SuccessStatisticsResponse extends BasicResultsResponse {
    result: 'ok';
    statistics: Statistics;
  }

  interface ErrorStatisticsResponse extends BasicResultsResponse {
    result: 'error';
  }

  export type StatisticsResponse =
    | SuccessStatisticsResponse
    | ErrorStatisticsResponse;
}

export type MangaLinks = {
  al?: string;
  ap?: string;
  bw?: string;
  mu?: string;
  nu?: string;
  kt?: string;
  amz?: string;
  cdj?: string;
  ebj?: string;
  mal?: string;
  raw?: string;
  engtl?: string;
};

export type MangaLinkKey = keyof MangaLinks;

export enum TagMode {
  AND = 'AND',
  OR = 'OR',
}

export enum ReadingStatus {
  Reading = 'reading',
  OnHold = 'on_hold',
  PlanToRead = 'plan_to_read',
  Dropped = 'dropped',
  ReReading = 're_reading',
  Completed = 'completed',
}

interface BasicReadingStatusResponse {
  result: 'ok' | 'error';
}

interface ErrorReadingStatusResponse extends BasicReadingStatusResponse {
  result: 'error';
  errors: MangadexError[];
}

interface SuccessReadingStatusResponse extends BasicReadingStatusResponse {
  status: ReadingStatus;
}

export type ReadingStatusResponse =
  | ErrorReadingStatusResponse
  | SuccessReadingStatusResponse;

export interface AllReadingStatusResponse {
  statuses: {
    [key: string]: ReadingStatus;
  };
}

interface SuccessReadingStatusUpdateResponse
  extends BasicReadingStatusResponse {
  result: 'ok';
}

interface ErrorReadingStatusUpdateResponse extends BasicReadingStatusResponse {
  result: 'error';
  errors: MangadexError[];
}

export type ReadingStatusUpdateResponse =
  | SuccessReadingStatusUpdateResponse
  | ErrorReadingStatusUpdateResponse;

export interface SearchState {
  title: string;
  artists: string[];
  authors: string[];
  year: Maybe<number>;
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
  order: Order<'createdAt' | 'updatedAt'>;
  includes: string[];
  hasAvailableChapters: '0' | '1' | 'true' | 'false';
}

export interface MangaSearchOptions {
  title: string;
  artists: Author[];
  authors: Author[];
  year: Maybe<number>;
  includedTags: Manga.Tag[];
  includedTagsMode: TagMode[];
  excludedTags: Manga.Tag[];
  excludedTagsMode: TagMode[];
  status: MangaStatus[];
  originalLanguage: string[];
  excludedOriginalLanguage: string[];
  availableTranslatedLanguage: string[];
  publicationDemographic: PublicationDemographic[];
  createdAtSince: string;
  updatedAtSince: string;
  contentRating: ContentRating[];
  order: Order<'createdAt' | 'updatedAt'>;
  includes: string[];
  hasAvailableChapters: '0' | '1' | 'true' | 'false';
}
