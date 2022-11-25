import React, {useState} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Appbar, Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import axiosInstance from '../../utils/request';
import {FindPasswordNavigationProp} from '../../navigation/FindPasswordStack';
import {AuthNavigationProp} from '../../navigation/AuthStack';
import {AuthContext} from '../../components/context';

const VerifyWayScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const authNavigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<any>();
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isAlert, setIsAlert] = React.useState<boolean>(false);
  const [alertMessage, setAlertMessage] = React.useState<any>();
  const {theme} = React.useContext<any>(AuthContext);

  const handleSubmit = async () => {
    setLoading(true);
    const jsencrypt = new JSEncrypt({});
    jsencrypt.setPublicKey(
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1d/4OjtZKvWDgp9yFaAiQmhAB0EvupK38QgcrdxcPjuK/BNhTHXgXAPPV1GNNN5dEctHpS2V10DFgqcjBT4iUm9U0edbexYhOmmoJhBp7IGwE1joM7lw0Ik8MfrLKJfDq2R6D8EnqnnBmVBc88jDRdhyw/W9PDxbAcTVAw0pmqLQpkuVID54gutjolt259Sb/70cHJT0fr9hqytUMl83yDy/6bw1rUBjjlr2ICDOZpsPaMB/blqDBRkfpBTwkJT2Xvax6Ik2e5I409RDQA9c/TDfsQYoWp8MqxzErHL66mPpQf05w7uFRB1CTsaaSIw9myHsi4m0FwYCziDs7pEv+QIDAQAB',
    );

    try {
      const {data} = await axiosInstance.post(
        '/user/BackPassword/magicApiJSON.do',
        {
          SigninName: route.params?.userName,
          Type: 1,
          OpeType: route.params?.method === 'phone' ? 1 : 2,
          Email: route.params?.email && jsencrypt.encrypt(value),
          Phone: route.params?.phone && jsencrypt.encrypt(value),
          VerCode: '',
          authInfo: {
            reqTime: new Date().getTime(),
            reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
          },
        },
      );
      navigation.navigate('VerfifyCodeScreen', {
        ...data.sendInfo,
        method: route?.params?.method,
      });
    } catch (error: any) {
      setIsAlert(true);
      setAlertMessage({message: error.message || '网络异常'});
    }
    setLoading(false);
  };

  const _goBack = () => navigation.goBack();

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
            styles.text,
            {
              fontWeight: '500',
              fontSize: 28,
              textAlign: 'left',
              borderRadius: 4,
            },
          ]}>
          {route?.params?.method === 'phone' && '请填写手机号码'}
          {route?.params?.method === 'email' && '请填写邮件'}
        </Text>
        <Text
          style={[
            {
              textAlign: 'left',
              marginTop: 10,
              fontSize: 16,
              color: 'grey',
            },
          ]}>
          {route.params.method === 'phone' &&
            `请填写完整的手机号 ${route.params?.phone} 以验证身份`}
          {route.params.method === 'email' &&
            `请填写完整的邮箱 ${route.params?.email} 以验证身份`}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            alignSelf: 'center',
            marginTop: 20,
            width: '94%',
          },
        ]}
        onChangeText={e => setValue(e)}
        value={value}
      />
      <Button
        disabled={Boolean(!value)}
        loading={loading}
        style={{
          width: 280,
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 40,
        }}
        contentStyle={{width: '100%', height: '100%'}}
        labelStyle={{textAlign: 'center'}}
        mode="contained"
        buttonColor="#096BDE"
        onPress={handleSubmit}>
        下一步
      </Button>
      <Button
        style={{
          width: 280,
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 14,
          borderColor: '#096BDE',
        }}
        contentStyle={{width: '100%', height: '100%'}}
        labelStyle={{textAlign: 'center', color: '#096BDE'}}
        mode="outlined"
        onPress={() => authNavigation.navigate('SignInScreen')}>
        立即登录
      </Button>

      <Portal>
        <Dialog
          visible={isAlert}
          style={{
            backgroundColor: theme.colors.background,
          }}
          onDismiss={() => {
            setAlertMessage(null);
            setIsAlert(false);
          }}>
          <Dialog.Icon icon="alert" color={theme.colors.error} />
          <Dialog.Title style={{textAlign: 'center'}}>验证失败</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{alertMessage?.message}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{color: theme.colors.primary}}
              onPress={() => {
                setAlertMessage(null);
                setIsAlert(false);
              }}>
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default VerifyWayScreen;

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
