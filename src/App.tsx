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
const { RealmProvider, useQuery, useRealm } = AppContext

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
          `ws://82.157.67.120:18084/wss/89CC42FEE09306971A4AE36868581BDD_2/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJMT0dJTiIsImlhdCI6MTY3MzE4NzExOSwiZXhwIjoxNjczNDQ2MzE5LCI4OUNDNDJGRUUwOTMwNjk3MUE0QUUzNjg2ODU4MUJERCI6ImNhdCJ9.YPawfJZMnVt4UplyGqcXC5AqAqCFY0vjGIjTr802VyE`,
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
        if (res.code === 10000 && res?.info) {
          res.info.map((info: any) => {
            if (info.url && info.userId && info.version) {
              const results = dataVersions.find(
                item =>
                  info.url === item.dataName && auth[0].userId === item.userId
              )

              if (Boolean(results)) {
                if (results?.dataVersion !== info.version) {
                  getMessagesHandler(false, false)
                  realm.write(() => {
                    // clean
                    realm.delete(results)

                    realm.create('DataVersion', {
                      _id: new Realm.BSON.ObjectId(),
                      dataName: info.url,
                      dataVersion: info.version,
                      userId: info.userId,
                      createdAt: new Date()
                    })
                  })
                } else {
                }
              } else {
                // getMessage
                getMessagesHandler(false, false)
                realm.write(() => {
                  realm.create('DataVersion', {
                    _id: new Realm.BSON.ObjectId(),
                    dataName: info.url,
                    dataVersion: info.version,
                    userId: info.userId,
                    createdAt: new Date()
                  })
                })
              }
            }
          })
        }

        if (res.url && res.userId && res.version) {
          const results = dataVersions.find(
            item => res.url === item.dataName && auth[0].userId === res.userId
          )

          if (Boolean(results)) {
            if (results?.dataVersion !== res.version) {
              getMessagesHandler(false, false)
              realm.write(() => {
                // clean
                realm.delete(results)

                realm.create('DataVersion', {
                  _id: new Realm.BSON.ObjectId(),
                  dataName: res.url,
                  dataVersion: res.version,
                  userId: res.userId,
                  createdAt: new Date()
                })
              })
            } else {
            }
          } else {
            // getMessage
            getMessagesHandler(false, false)
            realm.write(() => {
              realm.create('DataVersion', {
                _id: new Realm.BSON.ObjectId(),
                dataName: res.url,
                dataVersion: res.version,
                userId: res.userId,
                createdAt: new Date()
              })
            })
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
      <ThemeProvider theme={activeTheme}>
        <RealmPlugin realms={[realm]} />
        {/* {auth[0]?.token ? <AppStack /> : <AuthStack />} */}
        <StatusBar />
        <Navigations />
      </ThemeProvider>
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
