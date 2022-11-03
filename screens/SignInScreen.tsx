import React from 'react';
import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

const SignInScreen = () => {
  return (
    <View>
      <TextInput mode="outlined" dense label={'商家码'} />
      <TextInput mode="outlined" dense label={'用户名'} />
      <TextInput mode="outlined" dense label={'密码'} />
      <Button mode="contained-tonal" icon="sign-in">
        登录
      </Button>
    </View>
  );
};

export default SignInScreen;
