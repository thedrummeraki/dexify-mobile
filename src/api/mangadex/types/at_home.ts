import {MangadexError} from 'src/api/mangadex/types';

export interface AtHomeErrorResponse {
  result: 'error';
  errors: MangadexError[];
}

export interface AtHomeSuccessResponse {
  result: 'ok';
  baseUrl: string;
  chapter: AtHomeChapter;
}

export type AtHomeResponse = AtHomeErrorResponse | AtHomeSuccessResponse;

export interface AtHomeChapter {
  hash: string;
  data: string[];
  dataSaver: string[];
}
