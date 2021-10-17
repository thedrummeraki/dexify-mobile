import {UICategory} from '../../categories';

export function url(category: UICategory) {
  if (category.url) {
    return category.url;
  }

  const additionalParams = category.params
    ? new URLSearchParams(category.params).toString()
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
