import { useReducer } from 'react'
import useFetch from '../useFetch'
import CryptoJS from 'crypto-js'
import AppContext from '../../app/context/AppContext'
const { useRealm, useQuery } = AppContext
import JSEncrypt from 'jsencrypt'

type ReaducerType = 'LOADING' | 'SUCCESS' | 'FAIL' | 'RESTORE'

const useAuth = () => {
  const realm = useRealm()
  const { fetchData } = useFetch()

  const [state, dispatch] = useReducer(
    (
      prevState: {
        isLoading: boolean
        error: any
        data: any
      },
      action: {
        type: ReaducerType
        isLoading?: boolean
        error?: any
        data?: any
      }
    ) => {
      switch (action.type) {
        case 'LOADING':
          return {
            ...prevState,
            isLoading: true
          }
        case 'FAIL':
          return {
            ...prevState,
            isLoading: false,
            error: action.error
          }
        case 'SUCCESS':
          return {
            ...prevState,
            isLoading: false,
            data: action.data
          }
        case 'RESTORE':
          return {
            isLoading: false,
            error: undefined,
            data: {}
          }
        default:
          return prevState
      }
    },
    {
      isLoading: false,
      error: undefined,
      data: {}
    }
  )

  const signInHandler = async (value: any) => {
    dispatch({ type: 'LOADING' })
    const jsencrypt = new JSEncrypt({})
    jsencrypt.setPublicKey(
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1d/4OjtZKvWDgp9yFaAiQmhAB0EvupK38QgcrdxcPjuK/BNhTHXgXAPPV1GNNN5dEctHpS2V10DFgqcjBT4iUm9U0edbexYhOmmoJhBp7IGwE1joM7lw0Ik8MfrLKJfDq2R6D8EnqnnBmVBc88jDRdhyw/W9PDxbAcTVAw0pmqLQpkuVID54gutjolt259Sb/70cHJT0fr9hqytUMl83yDy/6bw1rUBjjlr2ICDOZpsPaMB/blqDBRkfpBTwkJT2Xvax6Ik2e5I409RDQA9c/TDfsQYoWp8MqxzErHL66mPpQf05w7uFRB1CTsaaSIw9myHsi4m0FwYCziDs7pEv+QIDAQAB'
    )
    const password = jsencrypt.encrypt(
      CryptoJS.SHA3(value.password as string, {
        outputLength: 512
      }).toString(CryptoJS.enc.Base64)
    )
    const data = {
      ...value,
      password: password,
      authInfo: {
        reqTime: new Date().getTime(),
        reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString()
      }
    }

    try {
      const authResponse = await fetchData(
        '/user/UserLogin/magicApiJSON.do',
        'POST',
        data
      )

      const userResponse = await fetchData(
        '/user/UserInfo/magicApiJSON.do',
        'POST',
        {
          authInfo: {
            ...authResponse.loginInfo.authInfo,
            reqTime: new Date().getTime(),
            reqUid: CryptoJS.MD5(
              new Date().getTime() +
                authResponse.loginInfo.authInfo.tenantId +
                authResponse.loginInfo.authInfo.userName
            ).toString()
          }
        }
      )

      realm.write(() => {
        realm.create('Auth', {
          _id: new Realm.BSON.ObjectId(),
          ...authResponse.loginInfo.authInfo,
          createdAt: new Date()
        })

        realm.create('User', {
          _id: new Realm.BSON.ObjectId(),
          userName: userResponse.userInfo.basicInfo.userName,
          phoneNum: userResponse.userInfo.basicInfo.phoneNum,
          isDelete: userResponse.userInfo.basicInfo.isDelete,
          createTime: new Date(),
          createdAt: new Date()
        })

        realm.create('Store', {
          _id: new Realm.BSON.ObjectId(),
          storeCode: userResponse.userInfo.storeInfo.storeCode,
          storeName: userResponse.userInfo.storeInfo.storeName,
          tenantId: userResponse.userInfo.storeInfo.tenantId,
          createTime: new Date(),
          createdAt: new Date()
        })

        userResponse.userInfo.printInfos.map((printer: any) => {
          realm.create('Printer', {
            _id: new Realm.BSON.ObjectId(),
            bandName: printer.bandName,
            deviceId: printer.deviceId,
            deviceSecret: printer.deviceSecret,
            vendorName: printer.vendorName,
            createTime: new Date(),
            createdAt: new Date()
          })
        })
      })
      dispatch({ type: 'SUCCESS' })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络异常' })
    }
  }

  const signOutHandler = () => {
    realm.write(() => {
      realm.deleteAll()
    })
  }

  return {
    ...state,
    signInHandler,
    signOutHandler,
    dispatch
  }
}

export default useAuth
