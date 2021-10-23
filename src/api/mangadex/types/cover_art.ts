import {Relationship} from '.';

export interface CoverArt {
  id: string;
  type: 'cover_art';
  attributes: CoverAttributes;
  relationships: Relationship[];
}

export interface CoverAttributes {
  volume?: string | null;
  fileName: string;
  description: string;
  version: 1;
  createdAt: string;
  updatedAt: string;
}
