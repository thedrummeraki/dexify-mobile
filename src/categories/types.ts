type Params = string[][] | Record<string, string> | string;

interface UIBaseCategory {
  type: UICategoryType;
  loading?: boolean;
  title?: string;
  hideTitle?: boolean;
  description?: string;
  viewMore?: string;
  url?: string;
  ids?: Array<string>;
  params?: Params;
  requiresAuth?: boolean;
}

interface UICategoryWithURL extends UIBaseCategory {
  url: string;
  ids?: undefined;
  params?: undefined;
}

interface UICategoryWithResourceIds extends UIBaseCategory {
  ids: Array<string>;
  url?: undefined;
  params?: Params;
}

type UIUntypedCategory = UICategoryWithResourceIds | UICategoryWithURL;

export type UIMangaCategory = UIUntypedCategory & {
  type: 'manga';
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
