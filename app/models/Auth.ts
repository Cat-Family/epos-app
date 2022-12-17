import {Realm, createRealmContext} from '@realm/react';

export class Auth extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userName!: string;
  token!: string;
  tenantId!: string;
  clientVersion!: string;
  loginTime!: string;
  platform!: string;
  blackList!: boolean;
  userId!: string;
  ip!: string;
  createdAt!: Date;

  static schema = {
    name: 'Auth',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userName: 'string',
      token: 'string',
      tenantId: 'string',
      clientVersion: 'string',
      loginTime: 'string',
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
};

const AuthContext = createRealmContext(config);
export default AuthContext;
