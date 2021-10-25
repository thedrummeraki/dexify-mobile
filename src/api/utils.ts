import axios, {Axios, AxiosError, AxiosResponse} from 'axios';
import {useEffect, useState} from 'react';

interface RequestResult<T> {
  data?: T;
  response?: AxiosResponse<T>;
  loading: boolean;
  error?: AxiosError<T>;
}

export function useLazyGetRequest<T>(): [
  (url: string) => Promise<T | undefined>,
  RequestResult<T>,
] {
  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<T>>();

  const callback = async (url: string) => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    try {
      const response = await axios.get<T>(url);
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
