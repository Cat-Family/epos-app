import { Realm } from '@realm/react'

export class Request extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  version!: string
  database!: string
  path!: string
  body?: string
  headers?: string

  static schema = {
    name: 'Request',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      version: 'string',
      database: 'strnig',
      path: 'string',
      body: 'string?',
      headers: 'string?'
    }
  }
}
