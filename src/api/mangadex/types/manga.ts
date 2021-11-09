import {CoverArt, MangadexError, ScanlationGroup} from '.';
import {Order, Relationship} from './api';
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
  relationships: Relationship<Author | ScanlationGroup | CoverArt>[];
}

export interface MangaAttributes {
  title: Title;
  altTitles: Array<Title>;
  description: Description;
  links?: Maybe<MangaLinks>;
  lastChapter?: Maybe<string>;
  publicationDemographic?: Maybe<PublicationDemographic>;
  status?: Maybe<MangaStatus>;
  year?: Maybe<number>;
  contentRating?: Maybe<ContentRating>;
  tags: Array<Manga.Tag>;
  originalLanguage: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  isLocked?: boolean;
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

  interface BasicAggregate {
    result: 'ok' | 'error';
  }

  interface SuccessAggregate extends BasicAggregate {
    result: 'ok';
    volumes: VolumeAggregateInfo;
  }

  interface ErrorAggregate extends BasicAggregate {
    result: 'error';
  }

  export type Aggregate = SuccessAggregate | ErrorAggregate;
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
    [key: string]:
      | 'reading'
      | 'on_hold'
      | 'plan_to_read'
      | 'dropped'
      | 're_reading'
      | 'completed';
  };
}

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
  publicationDemographic: PublicationDemographic[];
  createdAtSince: string;
  updatedAtSince: string;
  contentRating: ContentRating[];
  order: Order<'createdAt' | 'updatedAt'>;
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
  publicationDemographic: PublicationDemographic[];
  createdAtSince: string;
  updatedAtSince: string;
  contentRating: ContentRating[];
  order: Order<'createdAt' | 'updatedAt'>;
}
