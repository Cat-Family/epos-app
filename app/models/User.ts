import {Realm} from '@realm/react';
export class User extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userName!: string;
  phoneNum!: string;
  isDelete!: string;
  createTime!: Date;
  auths!: Array<number>;
  createdAt!: Date;

  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userName: 'string',
      phoneNum: 'string',
      isDelete: 'string',
      createTime: 'date',
      auths: 'array',
      createdAt: 'date',
    },
  };
}
