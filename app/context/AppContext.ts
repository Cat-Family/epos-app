import {createRealmContext} from '@realm/react';
import {Auth} from '../models/Auth';
import {User} from '../models/User';
import {Printer} from '../models/Printer';
import {Store} from '../models/Store';

const config = {
  schema: [Auth, User, Printer, Store],
  schemaVersion: 6,
};

const AppContext = createRealmContext(config);
export default AppContext;
