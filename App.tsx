import React, {useEffect, useMemo} from 'react';
import {View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

import {AuthContext} from './components/context';
import AsyncStorage from '@react-native-community/async-storage';
import {CustomDarkTheme, CustomDefaultTheme} from './app/theme';

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: {type: any; userInfo?: any; authInfo?: any}) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isLoading: false,
            userInfo: action.userInfo,
            authInfo: action.authInfo,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userInfo: action.userInfo,
            authInfo: action.authInfo,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userInfo: null,
            authInfo: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userInfo: null,
      authInfo: null,
    },
  );
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  useEffect(() => {
    const bootstrapAsync = async () => {
      let authInfo;
      let userInfo;

      try {
        authInfo = await AsyncStorage.getItem('authInfo');
        userInfo = await AsyncStorage.getItem('userInfo');
      } catch (error) {
        console.log(error);
      }

      if (authInfo && userInfo) {
        dispatch({
          type: 'RESTORE_TOKEN',
          userInfo: JSON.parse(userInfo),
          authInfo: JSON.parse(authInfo),
        });
      } else {
        dispatch({
          type: 'RESTORE_TOKEN',
        });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (userInfo: any, authInfo: any) => {
        dispatch({type: 'SIGN_IN', userInfo, authInfo});
      },
      signOut: async () => {
        await AsyncStorage.removeItem('authInfo');
        await AsyncStorage.removeItem('userInfo');
        dispatch({type: 'SIGN_OUT'});
      },
      // signUp: async data => {
      // },
      setIsDarkTheme: (val: boolean) => {
        setIsDarkTheme(val);
      },
      authInfo: state.authInfo,
      userInfo: state.userInfo,
      theme,
      isDarkTheme,
    }),
    [state, dispatch],
  );

  if (state.isLoading) {
    return (
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
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {state.authInfo ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
};

export default App;
