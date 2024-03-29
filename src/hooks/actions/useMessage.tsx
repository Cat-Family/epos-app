import { useReducer } from 'react'
import useFetch from '../useFetch'
import AppContext from '../../app/context/AppContext'
import { Auth } from '../../app/models/Auth'
import { DataVersion } from '@/app/models/DataVersion'
const { useRealm, useQuery, useObject } = AppContext

type ReaducerType = 'LOADING' | 'SUCCESS' | 'FAIL' | 'RESTORE'

const useMessage = () => {
  const auth = useQuery(Auth)
  const realm = useRealm()
  const [state, dispatch] = useReducer(
    (
      prevState: {
        isLoading: boolean
        error: any
      },
      action: {
        type: ReaducerType
        isLoading?: boolean
        error?: any
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
            error: undefined,
            isLoading: false
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
  const { fetchData } = useFetch()

  const getMessagesHandler = async () => {
    try {
      dispatch({ type: 'LOADING' })
      const res = await fetchData(
        '/msg/QueryMessageList/magicApiJSON.do',
        'POST'
      )

      realm.write(() => {
        const messages = realm.objects('Message')
        realm.delete(messages)

        res.info.info.map((msg: any) => {
          try {
            realm.create('Message', {
              _id: msg.id,
              subject: msg.subject,
              content: msg.content,
              isTop: Boolean(msg.isTop),
              isRead: Boolean(msg.isRead),
              isHtml: Boolean(msg.isHtml),
              tenantId: msg.tenantId,
              userId: msg.userId,
              updatedAt: msg.updateTime,
              createdAt: msg.creatTime
            })
          } catch (error: any) {
            dispatch({ type: 'FAIL', error: error })
          }
        })

        const results = realm.objectForPrimaryKey<DataVersion & Realm.Object>(
          'DataVersion',
          res.info.url
        )
        if (results) {
          results.dataVersion = res.info.version
        } else {
          realm.create('DataVersion', {
            _id: res.info.url,
            dataVersion: res.info.version,
            userId: auth[0]?.userId,
            createdAt: new Date()
          })
        }
      })

      dispatch({
        type: 'SUCCESS'
      })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络错误' })
      console.log(error)
    }
  }

  const readMessageHandler = async (id: number) => {
    try {
      realm.write(() => {
        const msg = realm.objectForPrimaryKey<any>('Message', id)
        msg.isRead = true
        msg.updatedAt = new Date()

        const dataversion = realm
          .objects<any>('DataVersion')
          .find(it => it.dataName === 'api/appClient/msg/ChangeMessageStatus')

        dataversion.dataVersion += 1
      })
      await fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 1
      })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络错误' })
    }
  }

  const deleteMessageHandler = async (id: number) => {
    realm.write(() => {
      const msg = realm.objectForPrimaryKey<any>('Message', id)
      realm.delete(msg)

      const dataversion = realm
        .objects<any>('DataVersion')
        .find(it => it.dataName === 'api/appClient/msg/ChangeMessageStatus')

      dataversion.dataVersion += 1
    })
    try {
      fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 2
      })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error })
    }
  }
  const topMessageHandler = async (id: number) => {
    try {
      realm.write(() => {
        const msg = realm.objectForPrimaryKey<any>('Message', id)
        msg.updatedAt = new Date()
        msg.isTop = true

        const dataversion = realm.objectForPrimaryKey<
          DataVersion & Realm.Object
        >('DataVersion', 'api/appClient/msg/ChangeMessageStatus')

        if (dataversion) dataversion.dataVersion += 1
      })
      await fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 3
      })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络错误' })
    }
  }
  const unTopMessageHandler = async (id: number) => {
    try {
      realm.write(() => {
        const msg = realm.objectForPrimaryKey<any>('Message', id)
        msg.updatedAt = new Date()
        msg.isTop = false

        const dataversion = realm.objectForPrimaryKey<
          DataVersion & Realm.Object
        >('DataVersion', 'api/appClient/msg/ChangeMessageStatus')

        if (dataversion) dataversion.dataVersion += 1
      })

      await fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 4
      })
    } catch (error: any) {
      dispatch({ type: 'FAIL', error: error.message || '网络错误' })
    }
  }

  return {
    ...state,
    dispatch,
    getMessagesHandler,
    readMessageHandler,
    deleteMessageHandler,
    topMessageHandler,
    unTopMessageHandler
  }
}

export default useMessage
