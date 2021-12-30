import {Chapter, Manga} from 'src/api/mangadex/types';

export type FeedResponse = SuccessFeedResponse | ErrorFeedResponse;

interface BasicFeedResponse {
  response: 'feed';
}

interface SuccessFeedResponse extends BasicFeedResponse {
  result: 'ok';
  data: FeedData;
}

interface ErrorFeedResponse extends BasicFeedResponse {
  result: 'error';
  error: Exclude<any, null | undefined>;
}

export interface FeedData {
  updates?: {data: Chapter[]; manga: Manga[]};
  topManga?: Manga | null;
  randomManga?: Manga | null;
  popularManga?: Manga[];
  airingNow?: Manga[];
  readingNow?: Manga[];
  recentlyAdded?: Manga[];
}
