import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider, Text} from 'react-native-paper';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

import {Auth} from './app/models/Auth';
import AppContext from './app/context/AppContext';
const {RealmProvider, useQuery, useRealm} = AppContext;
import useTheme from './hooks/utils/useTheme';
import RealmPlugin from 'realm-flipper-plugin-device';
import useInit from './hooks/utils/useInit';

const App = () => {
  const {theme} = useTheme();
  const realm = useRealm();
  const auth = useQuery(Auth);
  useInit();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <RealmPlugin realms={[realm]} />
        {auth[0]?.token ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
};

const AppWrapper = () => {
  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  );
};

export default AppWrapper;
