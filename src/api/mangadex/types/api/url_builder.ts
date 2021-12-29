import {
  AuthorRequestParams,
  ChapterRequestParams,
  CoverRequestParams,
  CustomListRequestParams,
  MangaRequestParams,
  Order,
  ScanlationGroupRequestParams,
  SingleMangaRequestParams,
} from 'src/api/mangadex/types/api';
import {UIMangaCategory} from 'src/categories';
import {ContentRating, ScanlationGroup} from '..';

interface FeedOptions {
  only?:
    | 'readingNow'
    | 'popularManga'
    | 'airingNow'
    | 'randomManga'
    | 'recentlyAdded';
  contentRating?: ContentRating[];
}

export default class UrlBuilder {
  static API_URL = 'https://mangadex-client-proxy.herokuapp.com'; // 'https://api.mangadex.org';
  // static API_URL = 'http://192.168.2.24:3001';

  public static feed(params?: FeedOptions) {
    return this.buildUrl('/home/feed', params);
  }

  public static animeAiringInfo(mangaId: string) {
    return this.buildUrl('/home/manga/anime/airing/info', {mangaId});
  }

  public static mangaList(params?: Partial<MangaRequestParams>) {
    const defaultValues: Partial<MangaRequestParams> = {
      contentRating: [ContentRating.pornographic],
      includes: ['cover_art', 'artist', 'author', 'tag'],
    };

    return this.buildUrl('/manga', Object.assign(defaultValues, params));
  }

  public static mangaListForCategory(category: UIMangaCategory) {
    if (category.url) {
      return category.url;
    }

    const limit = category.ids ? category.ids.length : 10;
    const defaultParams = {
      ids: category.ids,
      contentRating: category.contentRatings,
      limit,
    };

    return this.mangaList(Object.assign(defaultParams, category.params));
  }

  public static mangaById(
    id: string,
    params?: Partial<SingleMangaRequestParams>,
  ) {
    const defaultValues: Partial<SingleMangaRequestParams> = {
      includes: ['cover_art', 'artist', 'author', 'tag'],
    };

    return this.buildUrl(`/manga/${id}`, Object.assign(defaultValues, params));
  }

  public static covers(params?: Partial<CoverRequestParams>) {
    return this.buildUrl('/cover', params);
  }

  public static chaptersList(params?: Partial<ChapterRequestParams>) {
    const defaultValues: Partial<ChapterRequestParams> = {
      contentRating: [
        ContentRating.safe,
        ContentRating.suggestive,
        ContentRating.erotica,
      ],
      includes: ['manga', 'scanlation_group'],
    };

    return this.buildUrl('/chapter', Object.assign(defaultValues, params));
  }

  public static mangaReadMarkers(id: string) {
    return this.buildUrl(`/manga/${id}/read`);
  }

  public static multipleMangaReadMarkers(id: string[], grouped = false) {
    return this.buildUrl('/manga/read', {
      ids: id,
      grouped: grouped ? 'true' : 'false',
    });
  }

  public static markChapterAsRead(chapter: {id: string}) {
    return this.buildUrl(`/chapter/${chapter.id}/read`);
  }

  public static unmarkChapterAsRead(chapter: {id: string}) {
    return this.buildUrl(`/chapter/${chapter.id}/read`);
  }

  public static currentUserCustomLists(
    params?: Partial<CustomListRequestParams>,
  ) {
    return this.buildUrl('/user/list', params);
  }

  public static customList(id: string) {
    return this.buildUrl(`/list/${id}`);
  }

  public static addMangaToCustomList(id: string, listId: string) {
    return this.buildUrl(`/manga/${id}/list/${listId}`);
  }

  public static removeMangaFromCustomList(id: string, listId: string) {
    return this.buildUrl(`/manga/${id}/list/${listId}`);
  }

  public static user(id: string) {
    return this.buildUrl(`/user/${id}`);
  }

  public static scanlationGroups(params?: ScanlationGroupRequestParams) {
    return this.buildUrl('/group', params);
  }

  public static scanlationGroup(id: string, params?: {includes: string}) {
    return this.buildUrl(`/group/${id}`, params);
  }

  public static authors(params?: AuthorRequestParams) {
    return this.buildUrl('/author', params);
  }

  public static author(id: string, params?: {includes: string[]}) {
    return this.buildUrl(`/author/${id}`, params);
  }

  // Generic methods

  public static buildUrl(path: string, params?: ParamsLike) {
    let urlParts = [
      UrlBuilder.API_URL,
      path.startsWith('/') ? path : `/${path}`,
    ];

    if (params) {
      urlParts = urlParts.concat('/?', this.paramsToString(params));
    }
    return urlParts.join('');
  }

  public static multipleParamsToString(...params: ParamsLike[]) {
    return params.map(param => this.paramsToString(param)).join('&');
  }

  public static paramsToString(params: ParamsLike) {
    if (typeof params === 'string') {
      return params;
    }

    const paramsParts: string[] = [];

    if (Array.isArray(params)) {
      params.forEach(([key, value]) => {
        paramsParts.push(`${key}=${value}`);
      });
    } else {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          paramsParts.push(value.map(value => `${key}[]=${value}`).join('&'));
        } else if (typeof value === 'object') {
          paramsParts.push(
            Object.entries(value)
              .map(([valueKey, value]) => `${key}[${valueKey}]=${value}`)
              .join('&'),
          );
        } else if (value) {
          paramsParts.push(`${key}=${value}`);
        }
      });
    }

    return paramsParts.join('&');
  }
}

export type ParamsLike =
  | {[key: string]: string | number | string[] | Order<any>}
  | string
  | string[][]
  | FeedOptions;
