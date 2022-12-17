import {Realm, createRealmContext} from '@realm/react';

export class Auth extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userName!: string;
  token!: string;
  tenantId!: string;
  clientVersion!: string;
  loginTime!: Date;
  platform!: string;
  blackList!: boolean;
  userId!: string;
  ip!: string;
  createdAt!: Date;

  static generate() {
    return {
      _id: new Realm.BSON.ObjectId(),
      userName: 'Tourist',
      token: null,
      tenantId: null,
      clientVersion: null,
      loginTime: null,
      platform: null,
      blackList: false,
      userId: null,
      ip: null,
      createdAt: new Date(),
    };
  }

  static schema = {
    name: 'Auth',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userName: 'string',
      token: 'string',
      tenantId: 'string',
      clientVersion: 'string',
      loginTime: 'date',
      platform: 'string',
      blackList: {type: 'bool', default: false},
      userId: 'string',
      ip: 'string',
      createdAt: 'date',
    },
  };
}

const config = {
  schema: [Auth],
  onFirstOpen(realm) {
    realm.write(() => {
      realm.create('Auth', {
        _id: new Realm.BSON.ObjectId(),
        userName: 'Tourist',
        token: null,
        tenantId: null,
        clientVersion: null,
        loginTime: null,
        platform: null,
        blackList: false,
        userId: null,
        ip: null,
        createdAt: new Date(),
      });
    });
  },
};

const AuthContext = createRealmContext(config);
export default AuthContext;
