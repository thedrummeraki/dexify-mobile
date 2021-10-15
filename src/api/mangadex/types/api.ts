export function defaultPagedResults<T>() {
  return {
    results: [] as Array<T>,
    limit: 0,
    offset: 0,
    total: 0,
  };
}

interface MangaDexError {
  id: string;
  status: number;
  title: string;
  detail: string;
}

interface BasicPagedResults<T> {
  result: 'ok' | 'error';
}

interface SuccessPagedResults<T> extends BasicPagedResults<T> {
  result: 'ok';
  response: 'collection';
  data: Array<T>;
  limit: number;
  offset: number;
  total: number;
}

interface ErrorPagedResults<T> extends BasicPagedResults<T> {
  result: 'error';
  errors: Array<MangaDexError>;
}

export type PagedResultsList<T> = SuccessPagedResults<T> | ErrorPagedResults<T>;

interface SuccessActionResult {
  result: 'ok';
}

interface ErrorActionResult {
  result: 'error';
  errors: Array<MangaDexError>;
}

export type ActionResult = SuccessActionResult | ErrorActionResult;

export interface GenericResponse<T> {
  result: 'ok' | 'ko';
  data: T;
  relationships: Array<Relationship>;
}

interface GenericAttributes {
  [key: string]: string;
}

export interface Relationship {
  id: string;
  type: string;
  related: string;
  attributes?: GenericAttributes;
}

export type Order<K extends keyof any> = {
  [P in K]?: 'asc' | 'desc';
};
