import CryptoJS from 'crypto-js';
import {
  getAndroidIdSync,
  getCarrierSync,
  getDeviceNameSync,
  getFingerprintSync,
  getHostSync,
  getMacAddressSync,
  getUniqueIdSync,
  getUserAgentSync,
  isEmulatorSync,
} from 'react-native-device-info';
import JSEncrypt from 'jsencrypt';
import AppContext from '../app/context/AppContext';
import {Auth} from '../app/models/Auth';
import {User} from '../app/models/User';
import {Store} from '../app/models/Store';
import {Printer} from '../app/models/Printer';
const {useQuery, useRealm} = AppContext;

export const baseURL: string = 'https://qianyushop.shop/api/appClient';

const useFetch = (): {
  fetchData: (
    url?: string,
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
  ) => Promise<any>;
} => {
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
  const userAggent = getUserAgentSync();
  const auth = useQuery(Auth);
  const user = useQuery(User);
  const printers = useQuery(Store);
  const store = useQuery(Printer);
  const realm = useRealm();

  const deviceInfo = {
    macAddress,
    androidId,
    fingerprint,
    deviceName,
    isEmulator,
    uniqueId,
    host,
    carrier,
    userAggent,
  };

  const fetchData = async (
    url?: string,
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
  ): Promise<any> => {
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
            tenantId: auth[0]?.tenantId,
            clientVersion: auth[0]?.clientVersion,
            userName: auth[0]?.userName,
            userId: auth[0]?.userId,
            token: auth[0]?.token,
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
          realm.write(() => {
            realm.delete(auth);
            realm.delete(user);
            realm.delete(printers);
            realm.delete(store);
          });
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

  return {fetchData};
};

export default useFetch;
