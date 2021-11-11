import {UICategory} from './types';
import {airingMangas} from 'src/api/mangadex';
import {useSession} from 'src/prodivers';
import {DexifyNavigationProp, useDexifyNavigation} from 'src/foundation';

export function useHomeCategories(): UICategory[] {
  const session = useSession();
  const navigation = useDexifyNavigation();

  return session
    ? authenticatedHomeCategories(navigation)
    : unauthenticatedCategories();
}

function authenticatedHomeCategories(
  navigation: DexifyNavigationProp,
): UICategory[] {
  return [
    {
      title: 'Your feed',
      type: 'chapter',
      description: 'Your personalized chapters feed.',
      url: 'https://api.mangadex.org/user/follows/manga/feed?includes[]=manga&limit=20',
    },
    {
      title: 'Most popular titles!',
      type: 'manga',
      description: 'Most popular manga on Mangadex.',
      url: 'https://api.mangadex.org/manga?order%5BfollowedCount%5D=desc&limit=20&includes[]=cover_art',
      viewMore: {
        onAction: () =>
          navigation.push('ShowMangaList', {
            title: 'Top 100 popular titles',
            params: {
              'order[followedCount]': 'desc',
              'includes[]': 'cover_art',
              limit: '100',
            },
          }),
      },
    },
    {
      title: 'Fall 2021 Seasonal manga',
      type: 'manga',
      ids: airingMangas,
      params: {
        'includes[]': 'cover_art',
        'order[followedCount]': 'desc',
      },
      viewMore: {
        onAction: () =>
          navigation.push('ShowMangaList', {
            title: 'Fall 2021 Seasonal manga',
            description:
              'These titles have an anime airing this season. Be on the look out for the "Anime" tab when viewing the manga.',
            ids: airingMangas,
            params: {'order[followedCount]': 'desc', 'includes[]': 'cover_art'},
          }),
      },
    },
    {
      title: 'New additions',
      type: 'manga',
      description: 'Newest titles added to Mangadex',
      url: 'https://api.mangadex.org/manga?order[createdAt]=desc&includes[]=cover_art&limit=50',
    },
  ];
}

function unauthenticatedCategories(): UICategory[] {
  return [
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
