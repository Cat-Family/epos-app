import {Realm} from '@realm/react';

const data = {
  userName: 'dog',
  phoneNum: '15696665345',
  isDelete: '0',
  createTime: '2022-11-16 17:06:35',
  auths: [19999],
};
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
