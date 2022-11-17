import React, {useState} from 'react';
import {Alert, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Appbar, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import CryptoJS from 'crypto-js';
import axiosInstance from '../../utils/request';
import {FindPasswordNavigationProp} from '../../navigation/FindPasswordStack';

const ForgotPassWordScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const [userName, setUserName] = useState('');

  const _goBack = () => navigation.goBack();

  const onChangeNumber = (value: string) => {
    setUserName(value);
  };
  const handleSubmit = async () => {
    try {
      const {data} = await axiosInstance.post(
        '/api/user/IsValidAccount/magicApiJSON.do',
        {
          userName,
          reqTime: new Date().getTime(),
          authInfo: {
            reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
          },
        },
      );
      navigation.navigate('FindPasswordWayScreen', {...data.userInfo});
    } catch (error: any) {
      Alert.alert(error.message || 'NetWork Error');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F4F3F3" barStyle="light-content" />
      <Appbar.Header style={{backgroundColor: '#F4F3F3'}}>
        <Appbar.BackAction onPress={_goBack} />
      </Appbar.Header>
      <View style={{alignItems: 'center', marginTop: 6}}>
        <Text
          style={[
            styles.text,
            {
              fontWeight: '400',
              fontSize: 26,
              textAlign: 'center',
              borderRadius: 4,
            },
          ]}>
          找回密码
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            alignSelf: 'center',
            marginTop: 40,
          },
        ]}
        onChangeText={onChangeNumber}
        value={userName}
        placeholder="输入账号"
      />
      <Button
        disabled={Boolean(!userName)}
        style={{
          width: 280,
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 28,
        }}
        contentStyle={{width: '100%', height: '100%'}}
        labelStyle={{textAlign: 'center'}}
        mode="contained"
        buttonColor="#096BDE"
        onPress={handleSubmit}>
        下一步
      </Button>
    </View>
  );
};

export default ForgotPassWordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3F3',
  },
  text: {
    color: '#000',
    marginTop: 5,
  },
  input: {
    width: 280,
    height: 58,
    borderWidth: 0,
    padding: 10,
    color: '#05375a',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#fff',
  },
});
