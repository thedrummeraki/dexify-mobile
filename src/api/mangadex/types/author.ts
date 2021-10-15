export interface Author {
  id: string;
  type: 'author';
  attributes: AuthorAttributes;
}

export interface AuthorAttributes {
  name: string;
  imageUrl: string | null;
  biography: Biography[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type Biography = {[key: string]: string};
