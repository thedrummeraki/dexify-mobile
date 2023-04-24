import {Chapter, Manga} from 'src/api/mangadex/types';
import {ReadingState} from 'src/prodivers';

export namespace Sections {
  interface BasicHome {
    type:
      | 'general'
      | 'continue-reading'
      | 'manga-recommendation'
      | 'chapters-list';
    slug?: string;
  }
  export interface GeneralHome extends BasicHome {
    type: 'general';
    title: string;
    manga: Manga[];
    hideIfEmpty?: boolean;
    viewMore?(): void;
  }

  export interface Chapters extends BasicHome {
    type: 'chapters-list';
    title: string;
    chapters: Chapter[];
    manga: Manga[];
    viewMore?(): void;
  }

  export interface ContinueReading extends BasicHome {
    type: 'continue-reading';
    chapters: ReadingState.Chapter[];
  }

  export interface MangaRecommendation extends BasicHome {
    type: 'manga-recommendation';
    manga: Manga;
  }

  export type HomeSection =
    | GeneralHome
    | ContinueReading
    | MangaRecommendation
    | Chapters;
}
