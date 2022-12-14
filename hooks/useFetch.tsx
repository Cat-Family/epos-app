import {useState, FC, useEffect, useContext, useMemo, useReducer} from 'react';
import {AuthContext} from '../components/context';
import CryptoJS from 'crypto-js';
import {
  getAndroidIdSync,
  getApiLevelSync,
  getAvailableLocationProvidersSync,
  getBaseOsSync,
  getBootloaderSync,
  getBuildIdSync,
  getCarrierSync,
  getDeviceNameSync,
  getFingerprintSync,
  getFirstInstallTimeSync,
  getHardwareSync,
  getHostSync,
  getInstallerPackageNameSync,
  getInstallReferrerSync,
  getInstanceIdSync,
  getIpAddressSync,
  getLastUpdateTimeSync,
  getMacAddressSync,
  getPhoneNumberSync,
  getProductSync,
  getSerialNumberSync,
  getSystemAvailableFeaturesSync,
  getTagsSync,
  getTypeSync,
  getUniqueId,
  getUniqueIdSync,
  getVersion,
  hasGmsSync,
  hasHmsSync,
  isEmulatorSync,
  useDeviceName,
  useIsEmulator,
} from 'react-native-device-info';
import JSEncrypt from 'jsencrypt';

export const baseURL: string = 'https://qianyushop.shop/api/appClient';

type ReaducerType = 'LOADING' | 'SUCCESS' | 'FAIL';

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
  run: () => Promise<void>;
  isLoading: boolean;
  error: any;
  data: any;
} => {
  const {signOut, authInfo} = useContext(AuthContext);
  const jsencrypt = new JSEncrypt({});
  jsencrypt.setPublicKey(
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1d/4OjtZKvWDgp9yFaAiQmhAB0EvupK38QgcrdxcPjuK/BNhTHXgXAPPV1GNNN5dEctHpS2V10DFgqcjBT4iUm9U0edbexYhOmmoJhBp7IGwE1joM7lw0Ik8MfrLKJfDq2R6D8EnqnnBmVBc88jDRdhyw/W9PDxbAcTVAw0pmqLQpkuVID54gutjolt259Sb/70cHJT0fr9hqytUMl83yDy/6bw1rUBjjlr2ICDOZpsPaMB/blqDBRkfpBTwkJT2Xvax6Ik2e5I409RDQA9c/TDfsQYoWp8MqxzErHL66mPpQf05w7uFRB1CTsaaSIw9myHsi4m0FwYCziDs7pEv+QIDAQAB',
  );
  const macAddress = jsencrypt.encrypt(getMacAddressSync());
  const androidId = jsencrypt.encrypt(getAndroidIdSync());
  const fingerprint = jsencrypt.encrypt(getFingerprintSync());
  const deviceName = getDeviceNameSync();
  const isEmulator = isEmulatorSync();
  const uniqueId = jsencrypt.encrypt(getUniqueIdSync());
  const host = jsencrypt.encrypt(getHostSync());
  const carrier = getCarrierSync();

  const deviceInfo = {
    macAddress,
    androidId,
    fingerprint,
    deviceName,
    isEmulator,
    uniqueId,
    host,
    carrier,
  };

  const [state, dispatch] = useReducer(
    (
      prevState: {isLoading: boolean; error: any; data: any},
      action: {
        type: ReaducerType;
        isLoading?: boolean;
        data?: any;
        error?: any;
      },
    ) => {
      switch (action.type) {
        case 'LOADING':
          return {
            ...prevState,
            isLoading: true,
          };
        case 'SUCCESS':
          return {
            ...prevState,
            isLoading: false,
            data: action.data,
          };
        case 'FAIL':
          return {
            ...prevState,
            isLoading: false,
            error: action.error,
          };
        default:
          return {
            ...prevState,
          };
      }
    },
    {
      isLoading: true,
      error: undefined,
      data: undefined,
    },
  );

  const fetchData = async (): Promise<void> => {
    let response;
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
          deviceInfo,
          ...body,
        }),
      });

      if (response.ok) {
        const parseResponse = await response.json();

        if (parseResponse.code === 10000) {
          return Promise.resolve(parseResponse.data);
        }
        if (parseResponse.code === -14444) {
          // logout
          signOut();
          return Promise.reject(parseResponse);
        }
        return Promise.reject(parseResponse);
      } else {
        return Promise.reject(response);
      }
    } catch (error: any) {
      return Promise.reject(error);
    }
  };

  const value = useMemo(
    () => ({
      run: async () => {
        try {
          dispatch({type: 'LOADING'});
          const res = await fetchData();
          dispatch({type: 'SUCCESS', data: res});
        } catch (error: any) {
          dispatch({type: 'FAIL'});
        }
      },
      ...state,
    }),
    [state, dispatch],
  );

  return {...value};
};

export default useFetch;
