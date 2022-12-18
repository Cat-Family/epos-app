import {createRealmContext} from '@realm/react';
import {Auth} from '../models/Auth';
import {User} from '../models/User';

const config = {
  schema: [Auth, User],
  schemaVersion: 3,
};

const AppContext = createRealmContext(config);
export default AppContext;
