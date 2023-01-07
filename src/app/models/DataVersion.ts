import { Realm } from '@realm/react'

export class DataVersion extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  dataName!: string
  dataVersion!: number
  userId!: string
  createdAt!: Date

  static schema = {
    name: 'DataVersion',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      dataName: 'string',
      dataVersion: 'int',
      userId: 'string',
      createdAt: 'date'
    }
  }
}
