import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {UICategory} from 'src/categories';
import {url} from 'src/components/CategoriesCollection/utils';
import {
  checkSessionValidity,
  SessionContext,
  SessionState,
  useSession,
  useUpdatedSession,
} from 'src/prodivers';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AuthResponse} from './mangadex/types';

export interface RequestResult<T> {
  data?: T;
  response?: AxiosResponse<T>;
  loading: boolean;
  error?: AxiosError<T>;
}

interface BasicRequestParams {
  hookUrl?: string;
  method: AxiosRequestType;
  refreshSession?: boolean;
  requireSession?: boolean;
  forceRefresh?: boolean;
  throwIfRefreshFails?: boolean;
}

interface QueryRequestParams extends BasicRequestParams {
  method: AxiosRequestType.Get;
}

interface MutatingRequestParams<Body> extends BasicRequestParams {
  method:
    | AxiosRequestType.Delete
    | AxiosRequestType.Post
    | AxiosRequestType.Put;
  data?: Body;
}

type RequestParams<Body> = QueryRequestParams | MutatingRequestParams<Body>;

export enum AxiosRequestType {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export function useAxiosRequestConfig(): AxiosRequestConfig {
  const session = useSession();
  const headers: Record<string, string> = {};

  if (session?.session?.value) {
    headers['Authorization'] = session.session.value;
    headers['x-auth-session'] = session.session.value;
  }

  if (session?.refresh.value) {
    headers['x-auth-refresh'] = session.refresh.value;
  }

  return {headers};
}

export function usePostRequest<T, Body = any>(hookUrl?: string) {
  return useAxiosRequest<T, Body>({
    hookUrl,
    method: AxiosRequestType.Post,
    refreshSession: true,
    forceRefresh: true,
    throwIfRefreshFails: true,
  });
}

export function usePutRequest<T, Body = any>(hookUrl?: string) {
  return useAxiosRequest<T, Body>({
    method: AxiosRequestType.Put,
    hookUrl,
    refreshSession: true,
    requireSession: true,
  });
}

export function useDeleteRequest<T>(hookUrl?: string) {
  return useAxiosRequest<T>({
    method: AxiosRequestType.Delete,
    hookUrl,
    refreshSession: true,
    requireSession: true,
  });
}

export function useLazyGetRequest<T>(
  hookUrl?: string,
): [(url?: string) => Promise<T | undefined>, RequestResult<T>] {
  return useAxiosRequest<T>({
    hookUrl,
    method: AxiosRequestType.Get,
    refreshSession: true,
  });
}

export function useGetRequest<T>(url: string): RequestResult<T> {
  const [callback, result] = useLazyGetRequest<T>();

  useEffect(() => {
    callback(url);
  }, []);

  return {...result};
}

export function useCategoryRequest<T>(category: UICategory): RequestResult<T> {
  const [loading, setLoading] = useState(true);
  const [callback, result] = useLazyGetRequest<T>();

  useEffect(() => {
    const categoryUrl = url(category);
    if (categoryUrl) {
      callback(categoryUrl).finally(() => setLoading(false));
    }
  }, [category]);

  return {...result, loading};
}

export function useAxiosRequest<T, Body = any>(
  params: RequestParams<Body>,
): [(url?: string, body?: Body) => Promise<T | undefined>, RequestResult<T>] {
  const {session, refreshToken} = useUpdatedSession(false);

  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<T>>();

  const callback = useCallback(
    async (callbackUrl?: string, body?: Body) => {
      const url = params.hookUrl || callbackUrl;
      if (!url) {
        throw new Error(
          'Missing url. Must be passed in from the hook or the callback',
        );
      }

      const requestMethod = session
        ? `[${params.method}]`
        : `[?${params.method}]`;
      const config: AxiosRequestConfig = {};

      if (params.refreshSession) {
        const refreshResponse = await refreshToken(session);
        if (refreshResponse?.result === 'ok') {
          config.headers = {
            Authorization: refreshResponse.token.session,
            'x-auth-session': refreshResponse.token.session,
            'x-auth-refresh': refreshResponse.token.refresh,
          };
        } else if (
          params.throwIfRefreshFails &&
          refreshResponse?.result === 'error'
        ) {
          throw new Error(`Token refresh failed for url ${url}`);
        } else if (params.requireSession && !session) {
          console.warn(
            'This request',
            requestMethod,
            url,
            'may fail because we could not refresh your token',
          );
        } else if (session) {
          config.headers = {
            Authorization: session.session.value,
            'x-auth-session': session.session.value,
            'x-auth-refresh': session.refresh.value,
          };
        }
      } else if (session) {
        // At this point, if the refreshResponse is undefined and the session
        // is present, then the session is valid.
        config.headers = {
          Authorization: session.session.value,
          'x-auth-session': session.session.value,
          'x-auth-refresh': session.refresh.value,
        };
      } else {
        console.warn('no session');
      }

      const requestConfig = config || {};

      console.log(
        requestMethod,
        url,
        'with header keys',
        Object.keys(config.headers || {}),
      );

      setLoading(true);
      setError(undefined);
      setData(undefined);

      try {
        const response = await request<T, Body>(
          params.method,
          url,
          requestConfig,
          body,
        );
        setData(response.data);
        setResponse(response);

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error as AxiosError<T>);
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [session, params],
  );

  return [callback, {data, loading, error, response}];
}

async function request<T, Body = any>(
  method: AxiosRequestType,
  url: string,
  config: AxiosRequestConfig,
  data?: Body,
) {
  switch (method) {
    case AxiosRequestType.Get:
      return await axios.get<T>(url, config);
    case AxiosRequestType.Post:
      return await axios.post<T>(url, data, config);
    case AxiosRequestType.Put:
      return await axios.put<T>(url, data, config);
    case AxiosRequestType.Delete:
      return await axios.delete<T>(url, config);
    default:
      throw new Error(
        `Unsupported method "${method}. Should be one of [${Object.values(
          AxiosRequestType,
        ).join(', ')}]"`,
      );
  }
}
