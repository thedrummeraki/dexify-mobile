import {UICategory} from '../../categories';

export function url(category: UICategory) {
  if (category.url) {
    return category.url;
  }

  if (category.loading) {
    return null;
  }

  let additionalParams = category.params
    ? new URLSearchParams(category.params).toString()
    : '';

  if (category.type === 'manga' && category.contentRatings) {
    additionalParams = additionalParams.concat(
      '&',
      category.contentRatings.map(cr => `contentRating[]=${cr}`).join('&')
    )
  }

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
