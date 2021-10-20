import {Title} from '../mangadex/types';

export namespace Kitsu {
  export interface PagedResultsList<T> {
    data: T[];
  }

  export interface Image {
    tiny?: string;
    large?: string;
    small?: string;
    medium?: string;
    original: string;
    meta: ImageMeta;
  }

  export interface ImageMeta {
    dimensions: ImageDimensions;
  }

  export type ImageDimensionSizes = 'tiny' | 'large' | 'small' | 'medium';

  export type ImageDimensions = {
    [key in ImageDimensionSizes]?: {width: number; height: number};
  };

  export type ShowType = 'ONA' | 'OVA' | 'TV' | 'movie' | 'music' | 'special';
  export type ShowStatus =
    | 'current'
    | 'finished'
    | 'tba'
    | 'unreleased'
    | 'upcoming';

  export interface Anime {
    id: string;
    type: 'anime';
    attributes: AnimeAttributes;
  }

  export interface AnimeAttributes {
    createdAt: string;
    updatedAt: string;
    slug: string;
    synopsis?: string;
    description?: string;
    titles: Title;
    canonicalTitle: string;
    abbreviatedTitles: string[];
    averageRating?: string;
    startDate?: string;
    endDate?: string;
    nextRelease?: string;
    popularityRank: number;
    ratingRank: number;
    ageRating: string;
    ageRatingGuide?: string;
    subtype?: ShowType;
    status: ShowStatus;
    tba?: string;
    posterImage: Image;
    coverImage: Image;
    episodeCount?: number;
    episodeLength?: number;
    totalLength?: number;
    youtubeVideoId?: string;
    showType: ShowStatus;
    nsfw: boolean;
  }
}
