export interface Author {
  id: string;
  type: 'author';
  attributes: AuthorAttributes;
}

export interface Artist {
  id: string;
  type: 'artist';
  attributes: AuthorAttributes;
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
