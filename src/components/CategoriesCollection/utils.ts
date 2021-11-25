import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {UICategory} from '../../categories';

export function url(category: UICategory) {
  if (category.url) {
    return category.url;
  }

  if (category.type === 'manga') {
    return UrlBuilder.mangaListForCategory(category);
  }

  if (category.loading) {
    return null;
  }

  let additionalParams = category.params
    ? UrlBuilder.paramsToString(category.params)
    : '';

  const idParams = category.ids
    ? category.ids.map(id => `ids[]=${id}`).join('&')
    : '';
  const params = [
    idParams,
    `limit=${category.ids?.length || 10}`,
    additionalParams,
  ]
    .filter(params => Boolean(params))
    .join('&');

  return `https://api.mangadex.org/${category.type}?${params}`;
}
