import {Chapter, Manga} from 'src/api/mangadex/types';

export interface HomePresenter {
  loading: boolean;
  errored: boolean;
  data?: HomePresenterData;
}

export interface HomePresenterData {
  topManga: Manga;
  homeSections: Sections.HomeSection[];
}

export namespace Sections {
  interface BasicHome {
    type: 'general' | 'continue-reading' | 'manga-recommendation';
    slug: string;
  }
  export interface GeneralHome extends BasicHome {
    type: 'general';
    title: string;
    manga: Manga[];
    viewMore?(): void;
  }

  export interface ContinueReading extends BasicHome {
    type: 'continue-reading';
    chapter: Chapter;
  }

  export interface MangaRecommendation extends BasicHome {
    type: 'manga-recommendation';
    manga: Manga;
  }

  export type HomeSection = GeneralHome | ContinueReading | MangaRecommendation;
}
