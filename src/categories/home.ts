import {UICategory} from './types';
import {airingMangas} from 'src/api/mangadex';

export function useHomeCategories(): UICategory[] {
  return [
    {
      title: 'Currently reading',
      type: 'manga',
      requiresAuth: true,
      url: 'https://api.mangadex.org/manga/status?status=reading&limit=10',
    },
    {
      title: 'Most popular titles',
      type: 'manga',
      description: 'Most popular manga on Mangadex.',
      url: 'https://api.mangadex.org/manga?order%5BfollowedCount%5D=desc&limit=20&includes[]=cover_art',
    },
    {
      title: 'Fall 2021 Seasonal manga',
      type: 'manga',
      description: 'These titles have an anime airing this season.',
      ids: airingMangas,
      params: {
        'includes[]': 'cover_art',
        'order[followedCount]': 'desc',
      },
    },
    {
      title: 'Latest chapters',
      type: 'chapter',
      description: 'Check out these newly uploaded chapters.',
      url: 'https://api.mangadex.org/chapter?order%5BpublishAt%5D=desc&limit=4&includes[]=manga',
    },
  ];
}

export function useBrowseCategories(): UICategory[] {
  return [
    {
      title: 'Browse by tag',
      url: 'https://api.mangadex.org/manga/tag',
      type: 'tag',
    },
    {
      title: 'Recently added on Mangadex',
      url: `https://api.mangadex.org/manga?order%5BcreatedAt%5D=desc&includes[]=cover_art&limit=50`,
      type: 'manga',
    },
    {
      title: 'Browse Scanlation groups',
      url: 'https://api.mangadex.org/group',
      type: 'group',
    },
  ];
}
