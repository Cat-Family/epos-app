import React, {useState} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Appbar, Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import CryptoJS from 'crypto-js';
import axiosInstance from '../../utils/request';
import {FindPasswordNavigationProp} from '../../navigation/FindPasswordStack';
import {AuthNavigationProp} from '../../navigation/AuthStack';
import {AuthContext} from '../../components/context';

const ForgotPassWordScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const authNavigation = useNavigation<AuthNavigationProp>();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAlert, setIsAlert] = React.useState<boolean>(false);
  const [alertMessage, setAlertMessage] = React.useState<any>();
  const {theme} = React.useContext<any>(AuthContext);

  const _goBack = () => navigation.goBack();

  const onChangeNumber = (value: string) => {
    setUserName(value);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const {data} = await axiosInstance.post(
        '/user/IsValidAccount/magicApiJSON.do',
        {
          userName,
          authInfo: {
            reqTime: new Date().getTime(),
            reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
          },
        },
      );
      navigation.navigate('FindPasswordWayScreen', {...data.userInfo});
    } catch (error: any) {
      setIsAlert(true);
      setAlertMessage({message: error.message || '网络异常'});
    }
    setLoading(false);
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
        loading={loading}
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
          <Dialog.Title style={{textAlign: 'center'}}>
            找回密码失败
          </Dialog.Title>
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
