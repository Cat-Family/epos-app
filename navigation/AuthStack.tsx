import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import FindPasswordScreen from '../screens/FindPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      {/* <Stack.Screen name="OnBoarding" component={OnBoardingScreen} /> */}
      {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
      {/* <Stack.Screen name="FindPassword" component={FindPasswordScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
