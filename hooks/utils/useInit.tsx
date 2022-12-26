import {useEffect, useState} from 'react';
import {Auth} from '../../app/models/Auth';

import AppContext from '../../app/context/AppContext';
import {DataVersion} from '../../app/models/DataVersion';
import useMessage from '../actions/useMessage';
const {RealmProvider, useQuery, useRealm} = AppContext;

function useInit() {
  const realm = useRealm();
  const {getMessagesHandler} = useMessage();

  const auth = useQuery(Auth);
  const dataVersions = useQuery(DataVersion);

  useEffect(() => {
    if (auth[0]?.tenantId && auth[0]?.userId) {
      const socket = new WebSocket(
        `ws://82.157.67.120:18084/wss/${auth[0].tenantId}_${auth[0].userId}`,
      );

      socket.onopen = () => {
        socket.send(JSON.stringify(auth[0]));
      };

      socket.addEventListener('message', async event => {
        const res = JSON.parse(event.data);

        try {
          if (res.url && res.userId && res.version) {
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
  }, [auth]);
}

export default useInit;
