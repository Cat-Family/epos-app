import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import {Auth} from './app/models/Auth';
import useTheme from './hooks/utils/useTheme';
import RealmPlugin from 'realm-flipper-plugin-device';
import {DataVersion} from './app/models/DataVersion';
import useMessage from './hooks/actions/useMessage';
import AppContext from './app/context/AppContext';
const {RealmProvider, useQuery, useRealm} = AppContext;

const App = () => {
  const {theme} = useTheme();
  const realm = useRealm();
  const auth = useQuery(Auth);
  const dataVersions = useQuery(DataVersion);
  const {getMessagesHandler} = useMessage();
  let socket: WebSocket | undefined;

  useEffect(() => {
    if (auth[0]?.token && auth[0]?.userId && auth[0]?.tenantId) {
      if (!socket) {
        try {
          socket = new WebSocket(
            `ws://82.157.67.120:18084/wss/${auth[0]?.tenantId}_${auth[0]?.userId}/${auth[0].token}`,
          );
        } catch (error) {
          console.log(error);
        }
      }

      if (socket) {
        socket.addEventListener('message', async event => {
          const res = JSON.parse(event.data);
          try {
            if (res.code === 10000 && res?.info) {
              res.info.map((info: any) => {
                if (info.url && info.userId && info.version) {
                  const results = dataVersions.find(
                    item =>
                      info.url === item.dataName &&
                      auth[0].userId === item.userId,
                  );

                  if (Boolean(results)) {
                    if (results?.dataVersion !== info.version) {
                      getMessagesHandler(false, false);
                      realm.write(() => {
                        // clean
                        realm.delete(results);

                        realm.create('DataVersion', {
                          _id: new Realm.BSON.ObjectId(),
                          dataName: info.url,
                          dataVersion: info.version,
                          userId: info.userId,
                          createdAt: new Date(),
                        });
                      });
                    } else {
                      console.log('ok');
                    }
                  } else {
                    // getMessage
                    getMessagesHandler(false, false);
                    realm.write(() => {
                      realm.create('DataVersion', {
                        _id: new Realm.BSON.ObjectId(),
                        dataName: info.url,
                        dataVersion: info.version,
                        userId: info.userId,
                        createdAt: new Date(),
                      });
                    });
                  }
                }
              });
            }

            if (res.url && res.userId && res.version) {
              console.log(auth[0].token);
              const results = dataVersions.find(
                item =>
                  res.url === item.dataName && auth[0].userId === res.userId,
              );

              if (Boolean(results)) {
                if (results?.dataVersion !== res.version) {
                  getMessagesHandler(false, false);
                  realm.write(() => {
                    // clean
                    realm.delete(results);

                    realm.create('DataVersion', {
                      _id: new Realm.BSON.ObjectId(),
                      dataName: res.url,
                      dataVersion: res.version,
                      userId: res.userId,
                      createdAt: new Date(),
                    });
                  });
                } else {
                  console.log('ok');
                }
              } else {
                // getMessage
                getMessagesHandler(false, false);
                realm.write(() => {
                  realm.create('DataVersion', {
                    _id: new Realm.BSON.ObjectId(),
                    dataName: res.url,
                    dataVersion: res.version,
                    userId: res.userId,
                    createdAt: new Date(),
                  });
                });
              }
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    }

    return () => {
      if (socket) {
        socket.close();
        socket = undefined;
      }
    };
  }, [auth[0]?.token, auth[0]?.userId, auth[0]?.tenantId]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <RealmPlugin realms={[realm]} />
        {auth[0]?.token ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
};

const AppWrapper = () => {
  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  );
};

export default AppWrapper;
