import {Order} from '.';
import {ContentRating, MangaStatus, PublicationDemographic, TagMode} from '..';
import {ReadingStatus} from '../manga';

export type MangaOrder = Order<
  'createdAt' | 'updatedAt' | 'followedCount' | 'relevance'
>;

export type MangaRequestParams = Partial<{
  title: string;
  artists: string[];
  authors: string[];
  ids: string[];
  year: number;
  includedTags: string[];
  includedTagsMode: TagMode;
  excludedTags: string[];
  excludedTagsMode: TagMode;
  status: MangaStatus[];
  originalLanguage: string[];
  excludedOriginalLanguage: string[];
  availableTranslatedLanguage: string[];
  publicationDemographic: PublicationDemographic[];
  group: string;
  createdAtSince: string;
  updatedAtSince: string;
  contentRating: ContentRating[];
  readingStatus: ReadingStatus[];
  order: MangaOrder;
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
  order: Order<
    | 'createdAt'
    | 'updatedAt'
    | 'publishAt'
    | 'readableAt'
    | 'volume'
    | 'chapter'
  >;
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

export type CoverRequestParams = Partial<{
  manga: string[];
  ids: string[];
  uploaders: string[];
  order: Order<'createdAt' | 'updatedAt' | 'volume'>;
  includes: string[];
  limit: number;
  offset: number;
}>;

export type VolumesAndChaptersParams = Partial<{
  translatedLanguage: string[];
  groups: string[];
}>;

export enum MangaRelationshipType {
  Monochrome = 'monochrome',
  Colored = 'colored',
  Preserialization = 'preserialization',
  Serialization = 'serialization',
  Prequel = 'prequel',
  Sequel = 'sequel',
  MainStory = 'main_story',
  SideStory = 'side_story',
  AdaptedFrom = 'adapted_from',
  SpinOff = 'spin_off',
  BasedOn = 'based_on',
  Doujinshi = 'doujinshi',
  SameFranchise = 'same_franchise',
  SharedUniverse = 'shared_universe',
  AlternateStory = 'alternate_story',
  AlternateVersion = 'alternate_version',
}

export interface MangadexSettings {
  userPreferences: MangadexSettingsUserPreferences;
  preferedLayout: MangadexSettingsPreferedLayout;
  metadata: MangadexSettingsMetadata;
}

export enum MangadexTheme {
  System = 'system',
  Slate = 'slate',
  Dark = 'dark',
  Light = 'light',
}

export interface MangadexSettingsUserPreferences {
  filteredLanguages: string[];
  originLanguages: string[];
  paginationCount: number;
  listMultiplier: number;
  showSafe: boolean;
  showSuggestive: boolean;
  showErotic: boolean;
  showHentai: boolean;
  theme: MangadexTheme;
  mdahPort443: boolean;
  dataSaver: boolean;
  groupBlacklist: string[];
  userBlacklist: string[];
  locale: string;
  interfaceLocale: string;
}

export interface MangadexSettingsPreferedLayout {
  listStyle: number;
  listStyleNoArt: number;
  feedStyle: number;
  oneLine: boolean;
  bottomNavPadding: number;
  ambient: boolean;
}

export interface MangadexSettingsMetadata {
  version: number;
}
