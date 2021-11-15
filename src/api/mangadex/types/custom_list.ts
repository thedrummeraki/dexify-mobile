import { Relationship } from ".";

export interface CustomList {
  id: string;
  type: 'custom_list';
  attributes: CustomListAttributes;
  relationships: Relationship[]
}

export interface CustomListAttributes {
  name: string;
  visibility: 'private' | 'public';
  version: number;
}
