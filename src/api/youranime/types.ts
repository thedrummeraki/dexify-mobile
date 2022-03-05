import {Kitsu} from '../kitsu';
import {Title} from '../mangadex/types';

export namespace YourAnime {
  export namespace GraphQL {
    export interface PageInfo {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursour?: string;
      totalCount: number;
    }

    export type Node<T> = T;
    export interface Edge<T> {
      cursor: string;
      node: Node<T>;
    }

    export interface Connection<T> {
      pageInfo: PageInfo;
      edges?: Array<Edge<T>>;
      nodes?: Array<Node<T>>;
    }
  }

  export interface AgeRating {
    rating: string;
    guide?: string;
  }

  export enum AiringStatus {
    CURRENT,
    FINISHED,
    COMING_SOON,
    UPCOMING,
    UNRELEASED,
  }

  export interface Link {
    urlType: string;
    value: string;
    color?: string;
    platform?: Platform;
  }

  export interface Tag {
    tagType: string;
    value: string;
    refUrl?: string;
    refId?: string;
  }

  type AnimeSearchResultAttributes =
    | 'titles'
    | 'canonicalTitle'
    | 'posterImage'
    | 'slug'
    | 'nsfw';

  export type AnimeSearchResult = Pick<
    Kitsu.AnimeAttributes,
    AnimeSearchResultAttributes
  > & {year?: number; platforms: Array<Platform>};

  export interface Anime {
    title: string;
    description: string;
    slug: string;
    showType: string;
    showCategory: string;
    popularity: number;
    popularityPercentage: number;
    relativePopularity: number;
    youtubeTrailerUrl: string;
    bannerUrl: string;
    posterUrl: string;
    rank: number;
    episodesCount: number;
    nsfw: boolean;
    ageRating: AgeRating;
    year?: number;
    startsOn?: string;
    endedOn?: string;
    airingAt?: string;
    nextEpisode?: number;
    status?: AiringStatus;
    friendlyStatus?: string;
    platforms: Platform[];
    links: Link[];
    tags: Tag[];
    titles: object;
  }

  export interface AiringSchedule {
    airingAt: number;
    episodeNumber: number;
    timeUntilAiring: number;
  }

  export interface Platform {
    name: string;
    title: string;
    colour: string;
    url: string;
    availableInMyCountry: boolean;
    blocked: boolean;
  }
}
