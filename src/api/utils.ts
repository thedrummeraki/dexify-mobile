import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {useEffect, useState} from 'react';
import {UICategory} from 'src/categories';
import {url} from 'src/components/CategoriesCollection/utils';
import {useSession} from 'src/prodivers';

export interface RequestResult<T> {
  data?: T;
  response?: AxiosResponse<T>;
  loading: boolean;
  error?: AxiosError<T>;
}

export function useAxiosRequestConfig(): AxiosRequestConfig {
  const session = useSession();
  const headers: Record<string, string> = {};

  console.log('headers 1', headers);

  if (session?.session?.value) {
    headers['Authorization'] = session.session.value;
    headers['x-auth-session'] = session.session.value;
  }

  console.log('headers 2', headers);
  if (session?.refresh.value) {
    headers['x-auth-refresh'] = session.refresh.value;
  }
  console.log('headers 3', headers);

  return {headers};
}

export function usePostRequest<T, Body = any>(
  hookUrl?: string,
): [(url?: string, body?: Body) => Promise<T | undefined>, RequestResult<T>] {
  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<T>>();

  const config = useAxiosRequestConfig();

  const callback = async (callbackUrl?: string, body?: Body) => {
    const url = hookUrl || callbackUrl;

    if (!url) {
      throw new Error(
        'Missing url. Must be passed in from the hook or the callback',
      );
    }

    console.log('[POST]', url, 'with body', body, 'config', config);
    setLoading(true);
    setError(undefined);
    setData(undefined);

    try {
      const response = await axios.post<T, AxiosResponse<T>, Body>(
        url,
        body,
        config,
      );

      setData(response.data);
      setResponse(response);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error, '[POST]', url);
        setError(error as AxiosError<T>);
      } else {
        console.error(error, '[POST]', url);
      }
    } finally {
      setLoading(false);
    }
  };

  return [callback, {data, response, loading, error}];
}

export function useLazyGetRequest<T>(
  hookUrl?: string,
): [(url?: string) => Promise<T | undefined>, RequestResult<T>] {
  const session = useSession();
  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<T>>();

  const config = useAxiosRequestConfig();

  const callback = async (callbackUrl?: string) => {
    const url = hookUrl || callbackUrl;
    if (!url) {
      throw new Error(
        'Missing url. Must be passed in from the hook or the callback',
      );
    }

    const method = session ? '[GET]' : '[?GET]';
    console.log(method, url);

    setLoading(true);
    setError(undefined);
    setData(undefined);

    try {
      const response = await axios.get<T>(url, config);
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
  };

  return [callback, {data, response, loading, error}];
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
