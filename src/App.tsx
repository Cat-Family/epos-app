import React, { useEffect, useState } from 'react'
import { Auth } from './app/models/Auth'
import RealmPlugin from 'realm-flipper-plugin-device'
import { DataVersion } from './app/models/DataVersion'
import useMessage from './hooks/actions/useMessage'
import AppContext from './app/context/AppContext'
import Navigations from './navigation/AppNavs'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import StatusBar from '@/components/status-bar'
import { useAtom } from 'jotai'
import { activeThemeAtom } from './states/theme'
import AuthStack from './navigation/AuthStack'
import AppStack from './navigation/AppStack'
const { RealmProvider, useQuery, useRealm, useObject } = AppContext
import { Provider } from 'react-native-paper'
import { Message } from './app/models/Message'

const App = () => {
  const realm = useRealm()
  const auth = useQuery(Auth)
  const dataVersions = useQuery(DataVersion)
  const { getMessagesHandler } = useMessage()
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined)
  const [activeTheme] = useAtom(activeThemeAtom)

  useEffect(() => {
    if (auth[0]?.token && auth[0]?.userId && auth[0]?.tenantId) {
      if (!socket || socket?.readyState !== 1) {
        console.log('create websocket...')
        // setSocket(
        // )
        const ws = new WebSocket(
          `ws://82.157.67.120:18084/wss/${auth[0].tenantId}_${auth[0].userId}/${auth[0].token}`,
          undefined,
          {
            headers: {
              test: 'test'
            }
          }
        )
        setSocket(ws)
      }
    }

    socket?.addEventListener('open', () => {
      socket.send(JSON.stringify(auth[0]))
      console.log('websocket is ready!')
    })

    socket?.addEventListener('message', async event => {
      const res = JSON.parse(event.data)
      console.log(res)
      try {
        if (res?.code === 10000 && res?.info) {
          res?.info.map((info: any) => {
            const results = realm.objectForPrimaryKey<
              DataVersion & Realm.Object
            >('DataVersion', info?.url)
            if (!results || results?.dataVersion !== info?.version) {
              getMessagesHandler()
            }
          })
        } else {
          const results = realm.objectForPrimaryKey<DataVersion & Realm.Object>(
            'DataVersion',
            res?.url
          )
          if (!results || results?.dataVersion !== res?.version) {
            await getMessagesHandler()
          }
        }
      } catch (error) {
        console.log('update data error by data versio:', error)
      }
    })

    socket?.addEventListener('error', error => {
      console.log('websocket error:', error)
    })

    socket?.addEventListener('close', event => {
      console.log('websocket close:', event.code)
    })

    return () => {
      if (!auth[0]) {
        if (socket?.readyState) {
          socket.close()
          setSocket(undefined)
        } else {
          setSocket(undefined)
        }
      }
    }
  }, [auth[0]?.token, auth[0]?.userId, auth[0]?.tenantId, socket?.readyState])

  return (
    <NavigationContainer>
      <Provider>
        <ThemeProvider theme={activeTheme}>
          <RealmPlugin realms={[realm]} />
          {auth[0]?.token ? <Navigations /> : <AuthStack />}
          <StatusBar />
        </ThemeProvider>
      </Provider>
    </NavigationContainer>
  )
}

const AppWrapper = () => {
  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  )
}

export default AppWrapper
