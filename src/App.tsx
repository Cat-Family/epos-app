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
const { RealmProvider, useQuery, useRealm } = AppContext
import { Provider } from 'react-native-paper'

const App = () => {
  const realm = useRealm()
  const auth = useQuery<Auth & Realm.Object>(Auth)
  const { getMessagesHandler } = useMessage()
  const [activeTheme] = useAtom(activeThemeAtom)

  useEffect(() => {
    if (auth[0]?.tenantId && auth[0]?.userId && auth[0]?.token) {
      let ws: WebSocket | undefined = new WebSocket(
        `ws://82.157.67.120:18084/wss/${auth[0]?.tenantId}_${auth[0]?.userId}/${auth[0]?.token}`
      )
      ws?.addEventListener('open', () => {
        ws.send(JSON.stringify(auth[0]))
        console.log('websocket is ready!')
      })

      ws?.addEventListener('message', async event => {
        const res = JSON.parse(event.data)
        console.log(res)
        ws?.send(JSON.stringify({ status: 'ok', ...event.data }))


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
          } else if (res?.code === 1) {
            ws = undefined
          } else {
            const results = realm.objectForPrimaryKey<
              DataVersion & Realm.Object
            >('DataVersion', res?.url)
            if (!results || results?.dataVersion !== res?.version) {
              await getMessagesHandler()
            }
          }
        } catch (error) {
          console.log('update data error by data versio:', error)
        }
      })

      ws?.addEventListener('error', error => {
        console.log('websocket error:', error)
      })

      ws?.addEventListener('close', event => {
        console.log('websocket close:', event.code)
      })
    }
  }, [auth[0]?.tenantId, auth[0]?.userId, auth[0]?.token])

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
