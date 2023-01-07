import { createRealmContext } from '@realm/react'
import { Auth } from '../models/Auth'
import { User } from '../models/User'
import { Printer } from '../models/Printer'
import { Store } from '../models/Store'
import { DataVersion } from '../models/DataVersion'
import { Message } from '../models/Message'

const config = {
  schema: [Auth, User, Printer, Store, DataVersion, Message],
  schemaVersion: 4
}

const AppContext = createRealmContext(config)
export default AppContext
