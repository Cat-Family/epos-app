import CryptoJS from 'crypto-js'
import Snackbar from 'react-native-snackbar'
import {
  getAndroidIdSync,
  getCarrierSync,
  getDeviceNameSync,
  getFingerprintSync,
  getHostSync,
  getMacAddressSync,
  getUniqueIdSync,
  getUserAgentSync,
  isEmulatorSync
} from 'react-native-device-info'
import JSEncrypt from 'jsencrypt'
import AppContext from '../app/context/AppContext'
import { Auth } from '../app/models/Auth'
const { useQuery, useRealm } = AppContext

export const baseURL: string = 'https://qianyushop.shop/api/appClient'
// export const baseURL: string = 'https://290b8407y1.oicp.vip/api/appClient'

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
    signal?: AbortSignal | undefined
  ) => Promise<any>
} => {
  const jsencrypt = new JSEncrypt({})
  jsencrypt.setPublicKey(
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1d/4OjtZKvWDgp9yFaAiQmhAB0EvupK38QgcrdxcPjuK/BNhTHXgXAPPV1GNNN5dEctHpS2V10DFgqcjBT4iUm9U0edbexYhOmmoJhBp7IGwE1joM7lw0Ik8MfrLKJfDq2R6D8EnqnnBmVBc88jDRdhyw/W9PDxbAcTVAw0pmqLQpkuVID54gutjolt259Sb/70cHJT0fr9hqytUMl83yDy/6bw1rUBjjlr2ICDOZpsPaMB/blqDBRkfpBTwkJT2Xvax6Ik2e5I409RDQA9c/TDfsQYoWp8MqxzErHL66mPpQf05w7uFRB1CTsaaSIw9myHsi4m0FwYCziDs7pEv+QIDAQAB'
  )
  const macAddress = jsencrypt.encrypt(getMacAddressSync())
  const androidId = jsencrypt.encrypt(getAndroidIdSync())
  const fingerprint = jsencrypt.encrypt(getFingerprintSync())
  const deviceName = getDeviceNameSync()
  const isEmulator = isEmulatorSync()
  const uniqueId = jsencrypt.encrypt(getUniqueIdSync())
  const host = jsencrypt.encrypt(getHostSync())
  const carrier = getCarrierSync()
  const userAggent = getUserAgentSync()
  const auth = useQuery(Auth)
  const realm = useRealm()

  const deviceInfo = {
    macAddress,
    androidId,
    fingerprint,
    deviceName,
    isEmulator,
    uniqueId,
    host,
    carrier,
    userAggent
  }

  const fetchData = (
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
    signal?: AbortSignal | undefined
  ) =>
    new Promise(async (resolve, reject) => {
      let response
      try {
        response = await fetch(baseURL + url, {
          method: method,
          mode: mode,
          credentials: credentials,
          headers: {
            'Content-Type': 'application/json',
            ...headers
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
              reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString()
            },
            deviceInfo,
            ...body
          })
        })

        if (response.ok) {
          const parseResponse = await response.json()

          if (parseResponse.code === 10000) {
            return resolve(parseResponse.data)
          } else if (parseResponse.code === -14444) {
            Snackbar.show({
              text: parseResponse.message,
              duration: Snackbar.LENGTH_INDEFINITE,
              numberOfLines: 2,
              textColor: 'white',
              backgroundColor: 'rgba(0,0,0,0.64)',
              action: {
                textColor: '#2185d0',
                text: '确定',
                onPress: () => {
                  realm.write(() => {
                    realm.deleteAll()
                  })
                }
              }
            })
            return reject(parseResponse)
          } else if (parseResponse.code === -14445) {
            Snackbar.show({
              text: parseResponse.message,
              duration: Snackbar.LENGTH_INDEFINITE,
              numberOfLines: 2,
              textColor: 'white',
              backgroundColor: 'rgba(0,0,0,0.64)',
              action: {
                textColor: '#2185d0',
                text: '确定',
                onPress: () => {
                  realm.write(() => {
                    realm.deleteAll()
                  })
                }
              }
            })
            return reject(parseResponse)
          } else {
            Snackbar.show({
              text: parseResponse.message,
              duration: Snackbar.LENGTH_SHORT,
              numberOfLines: 2,
              textColor: 'white',
              backgroundColor: 'rgba(0,0,0,0.64)',
              action: {
                textColor: '#2185d0',
                text: '确定',
                onPress: () => {
                  Snackbar.dismiss()
                }
              }
            })
            return reject(parseResponse)
          }
        } else {
          Snackbar.show({
            text: response.toString(),
            duration: Snackbar.LENGTH_SHORT,
            numberOfLines: 2,
            textColor: 'white',
            backgroundColor: 'rgba(0,0,0,0.64)',
            action: {
              textColor: '#2185d0',
              text: '确定',
              onPress: () => {
                Snackbar.dismiss()
              }
            }
          })
          return reject(response)
        }
      } catch (error: any) {
        Snackbar.show({
          text: error.message || '网络异常',
          duration: Snackbar.LENGTH_SHORT,
          numberOfLines: 2,
          textColor: 'white',
          backgroundColor: 'rgba(0,0,0,0.64)',
          action: {
            textColor: '#2185d0',
            text: '确定',
            onPress: () => {
              Snackbar.dismiss()
            }
          }
        })
        return reject(error)
      }
    })

  return { fetchData }
}

export default useFetch
