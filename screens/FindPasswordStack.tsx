import React, {useState} from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Appbar, Button} from 'react-native-paper';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {List} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthNavigationProp} from '../navigation/AuthStack';
import axiosInstance from '../utils/request';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

export type Props = {
  navigation: FindPasswordNavigationProp;
};

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

const FindPasswordWayScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const route = useRoute<any>();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F4F3F3" barStyle="light-content" />
      <Appbar.Header style={{backgroundColor: '#F4F3F3'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="身份验证"
          titleStyle={{fontSize: 18}}
          style={{paddingLeft: '26%'}}
        />
      </Appbar.Header>

      <MaterialCommunityIcons
        style={{
          textAlign: 'center',
          marginTop: 36,
        }}
        name="shield-account-outline"
        color="#34B73FBA"
        size={64}></MaterialCommunityIcons>
      <Text
        style={[
          styles.text,
          {textAlign: 'center', marginTop: 34, fontSize: 24, fontWeight: '500'},
        ]}>
        身份验证
      </Text>
      <Text
        style={[
          {textAlign: 'center', marginTop: 10, fontSize: 12, color: 'grey'},
        ]}>
        为了保护你的账号安全，验证通过后即可找回你的密码。
      </Text>
      <List.Section style={{paddingTop: 20}}>
        {route.params?.phone && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('VerifyWayScreen', {
                method: 'phone',
                phone: route.params.phone,
                userName: route.params.userName,
              })
            }
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 70,
              borderRadius: 4,
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <List.Item
              title="手机号码验证"
              description={`通过${route.params.phone}接收短信验证码`}
              left={props => <List.Icon {...props} icon="message" />}
              right={props => (
                <Ionicons
                  {...props}
                  color="#000"
                  size={20}
                  name="ios-enter-outline"
                />
              )}
            />
          </TouchableOpacity>
        )}
        {route.params?.emailAddr && (
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 70,
              borderRadius: 4,
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <List.Item
              onPress={() =>
                navigation.navigate('VerifyWayScreen', {
                  method: 'email',
                  email: route.params.emailAddr,
                  userName: route.params.userName,
                })
              }
              title="邮件验证"
              description={`通过${route.params.emailAddr}接收邮件验证码`}
              left={props => <List.Icon {...props} icon="email" />}
              right={props => (
                <Ionicons
                  {...props}
                  color="#000"
                  size={20}
                  name="ios-enter-outline"
                />
              )}
            />
          </TouchableOpacity>
        )}
      </List.Section>
    </View>
  );
};

const VerifyWayScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const route = useRoute<any>();
  const [value, setValue] = useState<string>('');

  const handleSubmit = async () => {
    const jsencrypt = new JSEncrypt({});
    jsencrypt.setPublicKey(
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1d/4OjtZKvWDgp9yFaAiQmhAB0EvupK38QgcrdxcPjuK/BNhTHXgXAPPV1GNNN5dEctHpS2V10DFgqcjBT4iUm9U0edbexYhOmmoJhBp7IGwE1joM7lw0Ik8MfrLKJfDq2R6D8EnqnnBmVBc88jDRdhyw/W9PDxbAcTVAw0pmqLQpkuVID54gutjolt259Sb/70cHJT0fr9hqytUMl83yDy/6bw1rUBjjlr2ICDOZpsPaMB/blqDBRkfpBTwkJT2Xvax6Ik2e5I409RDQA9c/TDfsQYoWp8MqxzErHL66mPpQf05w7uFRB1CTsaaSIw9myHsi4m0FwYCziDs7pEv+QIDAQAB',
    );

    try {
      const {data} = await axiosInstance.post(
        '/api/user/BackPassword/magicApiJSON.do',
        {
          SigninName: route.params.userName,
          Type: 1,
          OpeType: route.params.method === 'phone' ? 1 : 2,
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
      console.log(error);

      Alert.alert(error.message || 'NetWork Error');
    }
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
            `请填写完整的邮件 ${route.params?.email} 以验证身份`}
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
    </View>
  );
};

const VerfifyCodeScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const route = useRoute<any>();
  const [verifyCode, setVerifyCode] = useState('');

  const _goBack = () => navigation.goBack();

  const handleSubmit = async () => {
    try {
      const {data} = await axiosInstance.post(
        '/api/user/BackPassword/magicApiJSON.do',
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
      navigation.navigate('ResetPasswordScreen');
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

const ResetPasswordScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const _goBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F4F3F3" barStyle="light-content" />
      <Appbar.Header style={{backgroundColor: '#F4F3F3'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="重置密码"
          titleStyle={{fontSize: 18}}
          style={{paddingLeft: '26%'}}
        />
      </Appbar.Header>

      <Button
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
        onPress={() => navigation.navigate('SignInScreen')}>
        提交
      </Button>
    </View>
  );
};

export type FindPasswordParamList = {
  ForgotPassWordScreen: undefined;
  FindPasswordWayScreen: {};
  VerifyWayScreen: {};
  VerfifyCodeScreen: {};
  ResetPasswordScreen: undefined;
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
});