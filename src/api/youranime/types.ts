export namespace YourAnime {
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

  export interface Platform {
    name: string;
    title: string;
    colour: string;
    url: string;
    availableInMyCountry: boolean;
    blocked: boolean;
  }
}
