import {Relationship} from '.';

export namespace CustomList {
  export enum Visibility {
    Public = 'public',
    Private = 'private',
  }

  export interface CreateParams {
    name: string;
    visibility?: Visibility;
    manga?: string[];
  }

  export interface UpdateParams {
    name?: string;
    visibility?: Visibility;
  }
}

export interface CustomList {
  id: string;
  type: 'custom_list';
  attributes: CustomListAttributes;
  relationships: Relationship[];
}

export interface CustomListAttributes {
  name: string;
  visibility: CustomList.Visibility;
  version: number;
}
