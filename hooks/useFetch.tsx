import {useState, FC, useEffect, useContext, useMemo} from 'react';
import {AuthContext} from '../components/context';
import CryptoJS from 'crypto-js';

export const baseURL: string = 'https://qianyushop.shop/api/appClient';

const useFetch = <T,>(
  url: string,
  method?: string | undefined,
  body?: any,
  headers?: HeadersInit_ | undefined,
  credentials?: RequestCredentials_ | undefined,
  integrity?: string | undefined,
  keepalive?: boolean | undefined,
  mode?: RequestMode_ | undefined,
  referrer?: string | undefined,
  window?: any,
  signal?: AbortSignal | undefined,
): {
  refresh: () => void;
  loading: boolean;
  error: any;
  data: any;
} => {
  const [data, setData] = useState<any>();
  const {signOut, authInfo} = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
  const [reRequest, setReRequest] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      data: data,
    }),
    [data],
  );
  const fetchData = async (): Promise<void> => {
    let response;
    setLoading(true);
    try {
      response = await fetch(baseURL + url, {
        method: method,
        mode: mode,
        credentials: credentials,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        integrity,
        keepalive,
        referrer,
        window,
        signal,
        body: JSON.stringify({
          authInfo: {
            ...authInfo,
            reqTime: new Date().getTime(),
            reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
          },
          ...body,
        }),
      });

      if (response.ok) {
        const parseResponse = await response.json();

        if (parseResponse.code === 10000) {
          setData(parseResponse.data);
          setLoading(false);
          return Promise.resolve(parseResponse);
        }
        if (parseResponse.code === -14444) {
          // logout
          signOut();
          setError(parseResponse);
          setLoading(false);
          return Promise.reject(parseResponse);
        }
        setError(parseResponse);
        setLoading(false);
        return parseResponse;
      } else {
        setError(response);
        setLoading(false);
        return Promise.reject(response);
      }
    } catch (error: any) {
      setError(error);
      setLoading(false);
      return Promise.reject(error);
    }
  };

  const refresh = (): void => {
    setReRequest(!reRequest);
  };

  useEffect(() => {
    fetchData().catch(error => {
      // console.error(error);
    });

    return () => {
      setData(undefined);
      setError(undefined);
      setLoading(false);
    };
  }, [reRequest]);

  return {...value, loading, error, refresh};
};

export default useFetch;
