import { Realm } from '@realm/react'

export class DataVersion extends Realm.Object {
  _id!: string
  dataVersion!: number
  userId!: string
  createdAt!: Date

  static schema = {
    name: 'DataVersion',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      dataVersion: 'int',
      userId: 'string',
      createdAt: 'date'
    }
  }
}
