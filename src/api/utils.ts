import axios, {Axios, AxiosError, AxiosResponse} from 'axios';
import {useEffect, useState} from 'react';

export function useGetRequest<T>(url: string) {
  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<T>>();

  useEffect(() => {
    axios
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
  }, []);

  return {data, response, loading, error};
}
