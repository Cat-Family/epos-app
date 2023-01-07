import { useEffect, useReducer, useState } from 'react'
import useFetch from '../useFetch'
import { FindPasswordNavigationProp } from '../../navigation/FindPasswordStack'
import { useNavigation, useRoute } from '@react-navigation/native'
import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'
import { AuthNavigationProp } from '../../navigation/AuthStack'

type ReaducerType = 'LOADING' | 'SUCCESS' | 'FAIL' | 'RESTORE'
function useResetPassord() {
  const navigation = useNavigation<FindPasswordNavigationProp>()
  const authNavigation = useNavigation<AuthNavigationProp>()
  const { fetchData } = useFetch()
  const route = useRoute<any>()
  const [countdown, setCountdown] = useState(0)
  const jsencrypt = new JSEncrypt({})
  jsencrypt.setPublicKey(
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1d/4OjtZKvWDgp9yFaAiQmhAB0EvupK38QgcrdxcPjuK/BNhTHXgXAPPV1GNNN5dEctHpS2V10DFgqcjBT4iUm9U0edbexYhOmmoJhBp7IGwE1joM7lw0Ik8MfrLKJfDq2R6D8EnqnnBmVBc88jDRdhyw/W9PDxbAcTVAw0pmqLQpkuVID54gutjolt259Sb/70cHJT0fr9hqytUMl83yDy/6bw1rUBjjlr2ICDOZpsPaMB/blqDBRkfpBTwkJT2Xvax6Ik2e5I409RDQA9c/TDfsQYoWp8MqxzErHL66mPpQf05w7uFRB1CTsaaSIw9myHsi4m0FwYCziDs7pEv+QIDAQAB'
  )

  const [state, dispatch] = useReducer(
    (
      prevState: {
        isLoading: boolean
        error: string | undefined
      },
      action: {
        type: ReaducerType
        isLoading?: boolean
        error?: string
      }
    ) => {
      switch (action.type) {
        case 'LOADING':
          return {
            ...prevState,
            isLoading: true
          }
        case 'SUCCESS':
          return {
            ...prevState,
            isLoading: false
          }
        case 'FAIL':
          return {
            ...prevState,
            isLoading: false,
            error: action.error
          }
        case 'RESTORE':
          return {
            ...prevState,
            isLoading: false,
            error: undefined
          }
        default:
          return prevState
      }
    },
    {
      isLoading: false,
      error: undefined
    }
  )

  const forgotPasswordFindler = async (userName: string) => {
    try {
      dispatch({ type: 'LOADING' })
      const res = await fetchData(
        '/user/IsValidAccount/magicApiJSON.do',
        'POST',
        {
          userName
        }
      )
      dispatch({ type: 'RESTORE' })
      navigation.navigate('FindPasswordWayScreen', { ...res.userInfo })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message })
    }
  }

  const verifyWayHandler = async (value: string) => {
    dispatch({ type: 'LOADING' })
    try {
      const res = await fetchData(
        '/user/BackPassword/magicApiJSON.do',
        'POST',
        {
          SigninName: route.params?.userName,
          Type: 1,
          OpeType: route.params?.method === 'phone' ? 1 : 2,
          Email: route.params?.email && jsencrypt.encrypt(value),
          Phone: route.params?.phone && jsencrypt.encrypt(value),
          VerCode: ''
        }
      )
      navigation.navigate('VerfifyCodeScreen', {
        ...res.sendInfo,
        method: route?.params?.method
      })
      dispatch({ type: 'SUCCESS' })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络异常' })
    }
  }

  const reSendCodeHandler = async () => {
    try {
      await fetchData('/user/BackPassword/magicApiJSON.do', 'POST', {
        SigninName: route.params?.signinName,
        Type: 1,
        OpeType: route.params?.method === 'phone' ? 1 : 2,
        Email: route.params?.remail,
        Phone: route.params?.Phone,
        ReSend: '1',
        VerCode: ''
      })

      setCountdown(60)
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络异常' })
    }
  }

  const verifyCodeHandler = async (verifyCode: string) => {
    dispatch({ type: 'LOADING' })
    try {
      const res = await fetchData(
        '/user/BackPassword/magicApiJSON.do',
        'POST',
        {
          SigninName: route.params?.signinName,
          Type: 1,
          OpeType: route.params?.method === 'phone' ? 1 : 2,
          Email: route.params?.remail,
          Phone: route.params?.Phone,
          VerCode: verifyCode
        }
      )
      navigation.navigate('ResetPasswordScreen', {
        signinName: route.params?.signinName,
        verifyCode: res?.verifyCode
      })
      dispatch({ type: 'RESTORE' })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络异常' })
    }
  }

  const resetPasswordHandler = async (value: {
    password: string | undefined
    verifyPassword: string | undefined
  }) => {
    try {
      if (value.password && value.verifyPassword) {
        dispatch({ type: 'LOADING' })
        const response = await fetchData(
          '/user/ResetPassword/magicApiJSON.do',
          'POST',
          {
            SigninName: route.params.signinName,
            Password: jsencrypt.encrypt(
              CryptoJS.SHA3(value.password, {
                outputLength: 512
              }).toString(CryptoJS.enc.Base64)
            ),
            RepeatPassword: jsencrypt.encrypt(
              CryptoJS.SHA3(value.verifyPassword, {
                outputLength: 512
              }).toString(CryptoJS.enc.Base64)
            ),
            VerifyCode: route.params.verifyCode
          }
        )

        authNavigation.navigate('SignInScreen')
      } else {
        dispatch({
          type: 'FAIL',
          error: 'Password and verifyPassword is required!'
        })
      }
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络异常' })
    }
  }

  useEffect(() => {
    let timer: number
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }

    return () => {
      clearInterval(timer)
    }
  }, [countdown])

  return {
    ...state,
    countdown,
    dispatch,
    forgotPasswordFindler,
    verifyWayHandler,
    reSendCodeHandler,
    verifyCodeHandler,
    resetPasswordHandler
  }
}

export default useResetPassord
