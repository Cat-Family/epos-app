import {Realm, createRealmContext} from '@realm/react';

export class Printer extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  vendorName!: string;
  bandName!: string;
  deviceId!: string;
  deviceSecret!: string;
  createdAt!: Date;

  static schema = {
    name: 'Printer',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      vendorName: 'string',
      bandName: 'string',
      deviceId: 'string',
      deviceSecret: 'string',
      createdAt: 'date',
    },
  };
}
