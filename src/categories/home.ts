import {Manga} from '../api/mangadex/types';
import {UICategory} from './types';

export function useHomeCategories(): UICategory[] {
  return [
    {
      title: 'Currently reading',
      type: 'manga',
      requiresAuth: true,
      url: 'https://api.mangadex.org/manga/status?status=reading&limit=4',
    },
    {
      title: 'Top 10 manga',
      type: 'manga',
      description: 'Most popular manga on Mangadex.',
      url: 'https://api.mangadex.org/manga?order%5BfollowedCount%5D=desc&limit=4',
    },
    {
      title: 'Seasonal manga',
      type: 'manga',
      description: 'These titles have an anime airing right now!',
      ids: [
        'a96676e5-8ae2-425e-b549-7f15dd34a6d8',
        'bd6d0982-0091-4945-ad70-c028ed3c0917',
        '89daf9dc-075a-4aa5-873a-cc76bb287108',
        '6670ee28-f26d-4b61-b49c-d71149cd5a6e',
        'b49fd121-19bf-4344-a8e1-d1be7ca04e08',
      ],
      limit: 4,
    },
    {
      title: 'Latest chapters',
      type: 'chapter',
      description: 'Check out these newly uploaded chapters.',
      url: 'https://api.mangadex.org/chapter?order%5BpublishAt%5D=desc&limit=4',
    },
  ];
}