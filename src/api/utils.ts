import axios, {AxiosError, AxiosResponse} from 'axios';
import {useEffect, useState} from 'react';

interface RequestResult<T> {
  data?: T;
  response?: AxiosResponse<T>;
  loading: boolean;
  error?: AxiosError<T>;
}

export function useLazyGetRequest<T>(): [
  (url: string) => Promise<void>,
  RequestResult<T>,
] {
  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<T>>();

  const callback = async (url: string) => {
    return axios
      .get<T>(url)
      .then(response => {
        setData(response.data);
        setResponse(response);
      })
      .catch((error: AxiosError<T>) => {
        setError(error);
      })
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
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
