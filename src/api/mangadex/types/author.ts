import {Relationship} from '.';

export interface Author {
  id: string;
  type: 'author';
  attributes: AuthorAttributes;
  relationships: Relationship[];
}

export interface Artist {
  id: string;
  type: 'artist';
  attributes: AuthorAttributes;
  relationships: Relationship[];
}

export interface AuthorAttributes {
  name: string;
  imageUrl: string | null;
  biography: Biography[];
  twitter?: string;
  pixiv?: string;
  melonBook?: string;
  fanBox?: string;
  booth?: string;
  nicoVideo?: string;
  skeb?: string;
  fantia?: string;
  tumblr?: string;
  youtube?: string;
  website?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type Biography = {[key: string]: string};
