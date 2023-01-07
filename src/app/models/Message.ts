import { Realm } from '@realm/react'

export class Message extends Realm.Object {
  _id!: number
  subject!: string
  content!: string
  isTop!: boolean
  isRead!: boolean
  isHtml!: boolean
  tenantId!: string
  userId!: string
  updatedAt!: Date
  createdAt!: Date

  static schema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      subject: 'string',
      content: 'string',
      isTop: 'bool',
      isRead: 'bool',
      isHtml: 'bool',
      tenantId: 'string',
      userId: 'string',
      updatedAt: 'date',
      createdAt: 'date'
    }
  }
}
