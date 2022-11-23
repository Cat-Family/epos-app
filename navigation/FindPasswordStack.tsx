import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp} from '@react-navigation/native';
import ForgotPassWordScreen from '../screens/FindPassordScreens/ForgotPassWordScreen';
import FindPasswordWayScreen from '../screens/FindPassordScreens/FindPasswordWayScreen';
import VerifyWayScreen from '../screens/FindPassordScreens/VerifyWayScreen';
import VerfifyCodeScreen from '../screens/FindPassordScreens/VerfifyCodeScreen';
import ResetPasswordScreen from '../screens/FindPassordScreens/ResetPasswordScreen';

export type Props = {
  navigation: FindPasswordNavigationProp;
};

export type FindPasswordParamList = {
  ForgotPassWordScreen: undefined;
  FindPasswordWayScreen: {};
  VerifyWayScreen: {};
  VerfifyCodeScreen: {};
  ResetPasswordScreen: {};
};

export type FindPasswordNavigationProp = NavigationProp<FindPasswordParamList>;

const Stack = createNativeStackNavigator<FindPasswordParamList>();
const FindPasswordStack: React.FC<Props> = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="ForgotPassWordScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="ForgotPassWordScreen"
        component={ForgotPassWordScreen}
      />
      <Stack.Screen
        name="FindPasswordWayScreen"
        component={FindPasswordWayScreen}
      />
      <Stack.Screen
        name="VerifyWayScreen"
        component={VerifyWayScreen}
        options={({route}: any) => ({title: route.params.method})}
      />
      <Stack.Screen
        name="VerfifyCodeScreen"
        component={VerfifyCodeScreen}
        options={({route}: any) => ({title: route.params.method})}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default FindPasswordStack;
