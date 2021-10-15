interface UIBaseCategory {
  type: UICategoryType;
  title: string;
  description?: string;
  viewMore?: string;
  url?: string;
  ids?: Array<string>;
  limit?: number;
  requiresAuth?: boolean;
}

interface UICategoryWithURL extends UIBaseCategory {
  url: string;
  ids?: undefined;
  limit?: undefined;
}

interface UICategoryWithResourceIds extends UIBaseCategory {
  ids: Array<string>;
  url?: undefined;
  limit: number;
}

type UIUntypedCategory = UICategoryWithResourceIds | UICategoryWithURL;

export type UIMangaCategory = UIUntypedCategory & {
  type: 'manga';
};

export type UIChapterCategory = UIUntypedCategory & {
  type: 'chapter';
};

export type UICategory = UIMangaCategory | UIChapterCategory;
export type UICategoryType = 'manga' | 'chapter';
