import {
  Artist,
  Author,
  CoverArt,
  Manga,
  ScanlationGroup,
  User,
} from 'src/api/mangadex/types';
import {MangaRelationshipType} from './types';

export function defaultPagedResults<T>() {
  return {
    results: [] as Array<T>,
    limit: 0,
    offset: 0,
    total: 0,
  };
}

export interface MangadexError {
  id: string;
  status: number;
  title: string;
  detail: string;
}

export interface BasicResultsResponse {
  result: 'ok' | 'error';
}

interface SuccessPagedResults<T> extends BasicResultsResponse {
  result: 'ok';
  response: 'collection';
  data: Array<T>;
  limit: number;
  offset: number;
  total: number;
}

interface ErrorResponse extends BasicResultsResponse {
  result: 'error';
  errors: Array<MangadexError>;
}

export type PagedResultsList<T> = SuccessPagedResults<T> | ErrorResponse;

interface SuccessActionResult {
  result: 'ok';
}

interface ErrorActionResult {
  result: 'error';
  errors: Array<MangadexError>;
}

export type ActionResult = SuccessActionResult | ErrorActionResult;

export interface SuccessEntityResponse<T> extends BasicResultsResponse {
  result: 'ok';
  response: 'entity';
  data: T;
}

export type EntityResponse<T> = SuccessEntityResponse<T> | ErrorResponse;

interface GenericAttributes {
  [key: string]: string;
}

export type PossibleRelationship =
  | Manga
  | Author
  | Artist
  | CoverArt
  | ScanlationGroup
  | User;

export type PossibleRelationshipTypes = Pick<
  PossibleRelationship,
  'type'
>['type'];

export type Relationship<T = PossibleRelationship> =
  | {
      id: string;
      type: PossibleRelationshipTypes;
      related: MangaRelationshipType;
      attributes?: GenericAttributes;
    }
  | (T & {related?: MangaRelationshipType});

export type Order<K extends keyof any> = {
  [P in K]?: 'asc' | 'desc';
};
