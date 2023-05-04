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
import {wait} from 'src/utils';

export enum ResponseStatus {
  Pending = 0,
  Initiated = 1,
  Successful = 2,
  Error = 3,
}
export interface RequestResult<T> {
  data?: T;
  response?: AxiosResponse<T>;
  status: ResponseStatus;
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
type SimpleRequestParams<Body> = Omit<
  RequestParams<Body>,
  'method' | 'hookUrl'
>;

type LazyRequestResponse<T, Body = any> = [
  (
    url?: string,
    body?: Body,
    callbackParams?: SimpleRequestParams<Body>,
  ) => Promise<T | undefined>,
  RequestResult<T>,
];

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
    headers.Authorization = session.session.value;
    headers['x-auth-session'] = session.session.value;
  }

  if (session?.refresh.value) {
    headers['x-auth-refresh'] = session.refresh.value;
  }

  return {headers};
}

export function usePostRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
) {
  const options = Object.assign(
    {
      hookUrl,
      method: AxiosRequestType.Post,
      refreshSession: true,
      forceRefresh: true,
      throwIfRefreshFails: true,
    },
    params,
  );

  return useAxiosRequest<T, Body>(options);
}

export function usePutRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
) {
  const options = Object.assign(
    {
      method: AxiosRequestType.Put,
      hookUrl,
      refreshSession: true,
      requireSession: true,
    },
    params,
  );

  return useAxiosRequest<T, Body>(options);
}

export function useDeleteRequest<T>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
) {
  const options = Object.assign(
    {
      method: AxiosRequestType.Delete,
      hookUrl,
      refreshSession: true,
      requireSession: true,
    },
    params,
  );

  return useAxiosRequest<T>(options);
}

export function useLazyGetRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
) {
  const options = Object.assign(
    {
      hookUrl,
      method: AxiosRequestType.Get,
      refreshSession: true,
    },
    params,
  );

  return useAxiosRequest<T>(options);
}

export function useAuthenticatedLazyGetRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
): LazyRequestResponse<T> {
  const [callback, result] = useLazyGetRequest<T>(hookUrl, params);
  const authenticatedCallback = useAuthenticatedCallback(callback);

  return [authenticatedCallback, result];
}

export function useAuthenticatedPostRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
): LazyRequestResponse<T> {
  const [callback, result] = usePostRequest<T>(hookUrl, params);
  const authenticatedCallback = useAuthenticatedCallback(callback);

  return [authenticatedCallback, result];
}

export function useAuthenticatedPutRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
): LazyRequestResponse<T> {
  const [callback, result] = usePutRequest<T>(hookUrl, params);
  const authenticatedCallback = useAuthenticatedCallback(callback);

  return [authenticatedCallback, result];
}

export function useAuthenticatedDeleteRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
): LazyRequestResponse<T> {
  const [callback, result] = useDeleteRequest<T>(hookUrl, params);
  const authenticatedCallback = useAuthenticatedCallback(callback);

  return [authenticatedCallback, result];
}

export function useGetRequest<T>(
  url: string,
  params?: SimpleRequestParams<never>,
): RequestResult<T> {
  const [callback, result] = useLazyGetRequest<T>();

  useEffect(() => {
    callback(url, params);
  }, []);

  return {...result};
}

export function useCategoryRequest<T>(category: UICategory): RequestResult<T> {
  const [loading, setLoading] = useState(true);
  const [callback, result] = useLazyGetRequest<T>();

  useEffect(() => {
    const categoryUrl = url(category);
    if (categoryUrl) {
      wait(100).then(() =>
        callback(categoryUrl).finally(() => setLoading(false)),
      );
    }
  }, [category]);

  return {...result, loading};
}

export function useAuthenticatedCallback<T, Body = any>(
  callback: (url?: string, body?: Body) => Promise<T | undefined>,
) {
  const {refreshToken} = useUpdatedSession(false);

  const wrapperCallback = async (url?: string, body?: Body) => {
    const res = await refreshToken();
    if (!res || res?.result === 'ok') {
      return callback(url, body);
    }
  };

  return wrapperCallback;
}

export function useAxiosRequest<T, Body = any>(
  params: RequestParams<Body>,
): LazyRequestResponse<T> {
  const {session} = useUpdatedSession(false);

  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<T>>();
  const [status, setStatus] = useState(ResponseStatus.Pending);

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

      if (session) {
        // At this point, if the refreshResponse is undefined and the session
        // is present, then the session is valid.
        config.headers = {
          Authorization: `Bearer ${session.session.value}`,
          'x-auth-session': `Bearer ${session.session.value}`,
          'x-auth-refresh': session.refresh.value,
        };
      }

      const requestConfig = config || {};

      console.log(
        requestMethod,
        url,
        'with header keys',
        Object.keys(config.headers || {}),
      );

      setStatus(ResponseStatus.Initiated);
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
        setStatus(ResponseStatus.Successful);

        return response.data;
      } catch (error) {
        setStatus(ResponseStatus.Error);
        if (axios.isAxiosError(error)) {
          setError(error as AxiosError<T>);
        } else {
          console.error('error while fetching', url, ':', error);
        }
      } finally {
        setLoading(false);
      }
    },
    [session, params],
  );

  return [callback, {data, loading, error, response, status}];
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

export function requestStarted(status: ResponseStatus) {
  return status > ResponseStatus.Initiated;
}
