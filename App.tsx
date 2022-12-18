import React, {useEffect, useMemo} from 'react';
import {View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider, Text} from 'react-native-paper';
import {Realm, createRealmContext} from '@realm/react';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

import {Auth} from './app/models/Auth';
import {User} from './app/models/User';
import AppContext from './app/context/AppContext';
const {RealmProvider, useQuery, useObject, useRealm} = AppContext;

import {AuthContext} from './components/context';
import {CustomDarkTheme, CustomDefaultTheme} from './app/theme';

const App = () => {
  const realm = useRealm();

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  const auth = useQuery(Auth);
  const user = useQuery(User);

  // const object = useObject(Auth, new Realm.BSON.ObjectId('639dd287cf81b655778b9cde'));

  const authContext = useMemo(
    () => ({
      setIsDarkTheme: (val: boolean) => {
        setIsDarkTheme(val);
      },
      theme,
      isDarkTheme,
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {auth[0]?.token ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
};

const AppWrapper = () => {
  return (
    <RealmProvider
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <Image
            source={require('./assets/logo.png')}
            resizeMode="cover"
            style={{height: 200, width: 200}}
          />
        </View>
      }>
      <App />
    </RealmProvider>
  );
};

export default AppWrapper;
