import React, {useContext, useEffect} from 'react';
import {View, ActivityIndicator, Image} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

import {AuthContext} from './components/context';
import AsyncStorage from '@react-native-community/async-storage';

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: {type: any; userInfo?: any; authInfo?: any}) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userInfo: action.userInfo,
            authInfo: action.authInfo,
            isLoading: false,
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
      userToken: null,
    },
  );
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let authInfo;
      let userInfo;

      try {
        authInfo = await AsyncStorage.getItem('authInfo');
        userInfo = await AsyncStorage.getItem('userInfo');

        // userToken = await AsyncStorage.getItem('userInfo');
      } catch (error) {
        console.log(error);
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      if (authInfo && userInfo) {
        dispatch({
          type: 'RESTORE_TOKEN',
          authInfo: JSON.parse(authInfo),
          userInfo: JSON.parse(userInfo),
        });
      }
      dispatch({type: 'RESTORE_TOKEN'});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (userInfo: any, authInfo: any) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        dispatch({type: 'SIGN_IN', authInfo, userInfo});
      },
      signOut: async () => {
        await AsyncStorage.removeItem('authInfo');
        await AsyncStorage.removeItem('userInfo');
        dispatch({type: 'SIGN_OUT'});
      },
      // signUp: async data => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `SecureStore`
      // In the example, we'll use a dummy token
      // dispatch({type: 'SIGN_IN', token: 'dummy--token'});
      // },
      
    }),
    [],
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
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
