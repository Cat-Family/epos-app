import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import FindPasswordStack from '../screens/FindPasswordStack';
import {
  CompositeNavigationProp,
  NavigationProp,
} from '@react-navigation/native';
import {AuthContext} from '../components/context';

export type AuthParamList = {
  OnBoardingScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  FindPasswordStack: undefined;
};

export type AuthNavigationProp = NavigationProp<AuthParamList>;

const Stack = createNativeStackNavigator<AuthParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnBoardingScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="FindPasswordStack" component={FindPasswordStack} />
    </Stack.Navigator>
  );
};

export default AuthStack;
