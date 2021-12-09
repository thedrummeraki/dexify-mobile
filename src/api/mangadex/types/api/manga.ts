import {Order} from '.';
import {MangaRequestParams} from './types';

const API_URL = 'https://mangadex-client-proxy.herokuapp.com';
// const API_URL = 'http://192.168.2.24:3001';

type ParamsLike = {[key: string]: string | number | string[] | Order<any>};

export function buildGetManga(options: MangaRequestParams) {
  return buildUrl('/manga', paramsToString(options));
}

function paramsToString(params: ParamsLike) {
  const paramsParts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      paramsParts.push(value.map(value => `${key}[]=${value}`).join('&'));
    } else if (typeof value === 'object') {
      paramsParts.push(
        Object.entries(value)
          .map(([valueKey, value]) => `${key}[${valueKey}]=${value}`)
          .join('&'),
      );
    } else {
      paramsParts.push(`${key}=${value}`);
    }
  });

  return paramsParts.join('&');
}

function buildUrl(path: string, params?: string) {
  const urlParts = [API_URL, path.startsWith('/') ? path : `/${path}`];
  if (params) {
    urlParts.concat('?', params);
  }
  return urlParts.join('');
}
