import {UICategory} from '../../categories';

export function url(category: UICategory) {
  if (category.url) {
    return category.url;
  }

  const params = category.ids!.map(id => `ids[]=${id}`);
  if (category.limit) {
    params.push(`limit=${category.limit}`);
  }

  return `https://api.mangadex.org/${category.type}?${params.join('&')}`;
}
