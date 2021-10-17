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

interface BasicResultsResponse {
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
  errors: Array<MangaDexError>;
}

export type PagedResultsList<T> = SuccessPagedResults<T> | ErrorResponse;

interface SuccessActionResult {
  result: 'ok';
}

interface ErrorActionResult {
  result: 'error';
  errors: Array<MangaDexError>;
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

export interface Relationship {
  id: string;
  type: string;
  related: string;
  attributes?: GenericAttributes;
}

export type Order<K extends keyof any> = {
  [P in K]?: 'asc' | 'desc';
};
