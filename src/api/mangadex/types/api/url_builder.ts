import {
  ChapterRequestParams,
  CustomListRequestParams,
  MangaRequestParams,
  Order,
  SingleMangaRequestParams,
} from 'src/api/mangadex/types/api';
import {UIMangaCategory} from 'src/categories';
import {ContentRating} from '..';

interface FeedOptions {
  only?:
    | 'readingNow'
    | 'popularManga'
    | 'airingNow'
    | 'randomManga'
    | 'recentlyAdded';
}

export default class UrlBuilder {
  static API_URL = 'https://mangadex-client-proxy.herokuapp.com'; // 'https://api.mangadex.org';

  public static feed(params?: FeedOptions) {
    return this.buildUrl('/home/feed', params);
  }

  public static mangaList(params?: Partial<MangaRequestParams>) {
    const defaultValues: Partial<MangaRequestParams> = {
      contentRating: [
        ContentRating.safe,
        ContentRating.suggestive,
        ContentRating.erotica,
      ],
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
    return this.buildUrl(`/manga/${id}`, params);
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

  public static currentUserCustomLists(
    params?: Partial<CustomListRequestParams>,
  ) {
    return this.buildUrl('/user/list', params);
  }

  public static customList(id: string) {
    return this.buildUrl(`/list/${id}`);
  }

  public static user(id: string) {
    return this.buildUrl(`/user/${id}`);
  }

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
