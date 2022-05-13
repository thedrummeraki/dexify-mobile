import {Relationship} from '.';

export interface Chapter {
  id: string;
  type: 'chapter';
  attributes: ChapterAttributes;
  relationships: Relationship[];
}

export interface ChapterAttributes {
  title: string;
  volume: string | null;
  chapter: string | null;
  translatedLanguage: string;
  uploader: string;
  externalUrl: string | null;
  pages: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishAt: string;
  readableAt: string;
}
