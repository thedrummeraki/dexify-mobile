import {UICategory} from './types';
import {airingMangas} from 'src/api/mangadex';
import {useSession} from 'src/prodivers';
import {useGetRequest} from 'src/api/utils';
import {useEffect, useState} from 'react';

export function useHomeCategories(): UICategory[] {
  const session = useSession();
  const [currentlyReadingIds, setCurrentReadingIds] = useState<string[]>([]);

  const {data, error} = useGetRequest<{
    statuses: {
      [key: string]:
        | 'reading'
        | 'on_hold'
        | 'plan_to_read'
        | 'dropped'
        | 're_reading'
        | 'completed';
    };
  }>('https://api.mangadex.org/manga/status?status=reading');

  useEffect(() => {
    setCurrentReadingIds(
      Object.entries(data?.statuses || {})
        .filter(([_, status]) => status === 'reading')
        .map(([id, _]) => id),
    );
  }, [data]);

  return [
    {
      title: 'Currently reading',
      type: 'manga',
      ids: currentlyReadingIds,
      params: {
        'includes[]': 'cover_art',
      },
    },
    {
      title: 'Most popular titles!',
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
    {
      title: 'New additions',
      type: 'manga',
      description: 'Newest titles added to Mangadex',
      url: 'https://api.mangadex.org/manga?order[createdAt]=desc&includes[]=cover_art&limit=50',
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
