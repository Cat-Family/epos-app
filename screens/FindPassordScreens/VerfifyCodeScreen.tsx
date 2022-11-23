import React, {useState} from 'react';
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Appbar, Button} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import CryptoJS from 'crypto-js';
import axiosInstance from '../../utils/request';
import {FindPasswordNavigationProp} from '../../navigation/FindPasswordStack';

const VerfifyCodeScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const route = useRoute<any>();
  const [verifyCode, setVerifyCode] = useState('');

  const _goBack = () => navigation.goBack();

  const handleSubmit = async () => {
    try {
      const {data} = await axiosInstance.post(
        '/user/BackPassword/magicApiJSON.do',
        {
          SigninName: route.params.signinName,
          Type: 1,
          OpeType: route.params.method === 'phone' ? 1 : 2,
          Email: route.params.remail,
          Phone: route.params.Phone,
          VerCode: verifyCode,
          authInfo: {
            reqTime: new Date().getTime(),
            reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
          },
        },
      );
      navigation.navigate('ResetPasswordScreen', {
        signinName: route.params.signinName,
        verifyCode: data?.verifyCode,
      });
      console.log(data);
    } catch (error: any) {
      Alert.alert(error.message || 'NetWork Error');
    }
  };

  const resendHandler = async () => {
    // try {
    //   const {data} = await axiosInstance.post(
    //     '/api/user/BackPassword/magicApiJSON.do',
    //     {
    //       signinName: route.params.signinName,
    //       Type: 1,
    //       OpeType: route.params.method === 'phone' ? 1 : 2,
    //       Email: route.params.remail,
    //       Phone: route.params.Phone,
    //       VerCode: '',
    //       authInfo: {
    //         reqTime: new Date().getTime(),
    //         reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
    //       },
    //     },
    //   );
    //   // navigation.navigate('VerfifyCodeScreen', {
    //   //   ...data.sendInfo,
    //   //   method: route?.params?.method,
    //   // });
    //   console.log(data);
    // } catch (error: any) {
    //   console.log(error);
    //   Alert.alert(error.message || 'NetWork Error');
    // }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F4F3F3" barStyle="light-content" />
      <Appbar.Header style={{backgroundColor: '#F4F3F3'}}>
        <Appbar.BackAction onPress={() => _goBack()} />
        <Appbar.Content
          title="身份验证"
          titleStyle={{fontSize: 18}}
          style={{paddingLeft: '26%'}}
        />
      </Appbar.Header>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 18,
          width: '100%',
          height: 130,
        }}>
        <Text
          style={[
            {
              fontWeight: '500',
              fontSize: 28,
              textAlign: 'left',
              borderRadius: 4,
              color: '#000',
            },
          ]}>
          {route.params.method === 'phone' && '请输入短信验证码'}
          {route.params.method === 'email' && '请填写邮件验证码'}
        </Text>
        <Text
          style={[
            {
              marginTop: 10,
              fontSize: 16,
              color: 'grey',
            },
          ]}>
          {`已向 ${route.params.email || route.params.phone} 发送验证码`}
        </Text>
      </View>
      <View
        style={{
          marginTop: 20,
          alignSelf: 'center',
          padding: 8,
          width: '96%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text
          style={[
            styles.text,
            {
              textAlign: 'center',
            },
          ]}>
          验证码
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              alignSelf: 'center',
            },
          ]}
          onChangeText={e => {
            setVerifyCode(e);
          }}
          value={verifyCode}
          placeholder="输入账号/手机"
          keyboardType="numeric"></TextInput>
      </View>
      <TouchableOpacity
        style={{paddingLeft: 20, paddingTop: 10}}
        onPress={resendHandler}>
        <Text style={styles.text}>重新发送</Text>
      </TouchableOpacity>
      <Button
        style={{
          width: '96%',
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 20,
        }}
        contentStyle={{width: '100%', height: '100%'}}
        labelStyle={{textAlign: 'center'}}
        mode="contained"
        buttonColor="#096BDE"
        onPress={handleSubmit}>
        提交
      </Button>
    </View>
  );
};

export default VerfifyCodeScreen;

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
