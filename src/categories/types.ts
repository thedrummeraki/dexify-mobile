import {ContentRating, MangaRequestParams} from 'src/api/mangadex/types';
import {ParamsLike} from 'src/api/mangadex/types/api/url_builder';

export interface SecondaryAction {
  content?: string;
  icon?: string;
  onAction: () => void;
}

interface UIBaseCategory {
  type: UICategoryType;
  loading?: boolean;
  title?: string;
  hideTitle?: boolean;
  description?: string;
  viewMore?: SecondaryAction;
  url?: string;
  ids?: Array<string>;
  params?: ParamsLike;
  requiresAuth?: boolean;
}

interface WithJustParams extends UIBaseCategory {
  url?: undefined;
  ids?: undefined;
  params?: ParamsLike;
}

interface UICategoryWithURL extends UIBaseCategory {
  url: string;
  ids?: undefined;
  params?: undefined;
}

interface UICategoryWithResourceIds extends UIBaseCategory {
  ids: Array<string>;
  url?: undefined;
  params?: ParamsLike;
}

type UIUntypedCategory =
  | UICategoryWithResourceIds
  | UICategoryWithURL
  | WithJustParams;

export type UIMangaCategory = UIUntypedCategory & {
  type: 'manga';
  contentRatings?: ContentRating[];
  params?: MangaRequestParams;
};

export type UIChapterCategory = UIUntypedCategory & {
  type: 'chapter';
};
export type UIAuthorCategory = UIUntypedCategory & {
  type: 'author';
};
export type UITagCategory = UIUntypedCategory & {
  type: 'tag';
};
export type UIScanlationGroupCategory = UIUntypedCategory & {
  type: 'group';
};
export type UIReadingStatusCategory = UIUntypedCategory & {
  type: 'status';
  url: string;
  ids?: undefined;
  params?: undefined;
};

export type UICategory =
  | UIMangaCategory
  | UIChapterCategory
  | UIAuthorCategory
  | UITagCategory
  | UIScanlationGroupCategory
  | UIReadingStatusCategory;
export type UICategoryType =
  | 'manga'
  | 'chapter'
  | 'author'
  | 'tag'
  | 'group'
  | 'status';
