import {Realm, createRealmContext} from '@realm/react';

export class Store extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  storeCode!: string;
  tenantId!: string;
  storeName!: string;
  createTime!: Date;
  createdAt!: Date;

  static schema = {
    name: 'Store',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      storeCode: 'string',
      tenantId: 'string',
      storeName: 'string',
      createTime: 'date',
      createdAt: 'date',
    },
  };
}
