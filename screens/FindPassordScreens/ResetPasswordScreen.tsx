import React, {useLayoutEffect, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {object, ref, string, TypeOf} from 'yup';
import Feather from 'react-native-vector-icons/Feather';
import { FindPasswordNavigationProp } from '../../navigation/FindPasswordStack';

const ResetPasswordScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>();
  const validationSchema = object({
    password: string()
      .required('密码不能为空')
      .min(8, '密码长度需要大于8')
      .max(16, '密码长度不能超过16')
      .matches(
        /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
        '密码必须包含两种字符(不能为空格或是中文字符)',
      ),
    verifyPassword: string()
      .required('确认密码不能为空')
      .oneOf([ref('password'), null], '密码不匹配'),
  });
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  type ValidationInput = TypeOf<typeof validationSchema>;

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    getFieldState,
    formState: {errors, isSubmitted},
  } = useForm<ValidationInput>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = () => {};

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F4F3F3" barStyle="light-content" />
      <Appbar.Header style={{backgroundColor: '#F4F3F3'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="设置新密码"
          titleStyle={{fontSize: 18}}
          style={{paddingLeft: '26%'}}
        />
      </Appbar.Header>

      <Controller
        defaultValue=""
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <>
            <View
              style={{
                width: '96%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderBottomColor: '#1111',
                borderBottomWidth: 1,
              }}>
              <Text style={{color: '#000'}}>新密码</Text>
              <TextInput
                style={{flex: 1, paddingLeft: 20, color: '#666666'}}
                placeholder="请设置新密码"
                placeholderTextColor="#666666"
                value={value}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={secureTextEntry ? true : false}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {!secureTextEntry ? (
                  <Feather name="eye" color="grey" size={20} />
                ) : (
                  <Feather name="eye-off" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
        name="password"
      />

      <Controller
        defaultValue=""
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <>
            <View
              style={{
                width: '96%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderBottomColor: '#1111',
                borderBottomWidth: 1,
              }}>
              <Text style={{color: '#000'}}>确认密码</Text>
              <TextInput
                style={{flex: 1, paddingLeft: 20, color: '#666666'}}
                placeholder="请再次输入新密码"
                placeholderTextColor="#666666"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={secureTextEntry ? true : false}
              />
            </View>
          </>
        )}
        name="verifyPassword"
      />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}>
        <Ionicons
          style={{padding: 2}}
          size={18}
          color={isSubmitted ? (errors.password ? 'grey' : 'green') : 'grey'}
          name="ios-checkmark-circle-outline"
        />
        <Text style={{color: '#666666'}}>密码由8-16位数字、字母或符号组成</Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}>
        <Ionicons
          style={{padding: 2}}
          size={18}
          color={isSubmitted ? (errors.password ? 'grey' : 'green') : 'grey'}
          name="ios-checkmark-circle-outline"
        />
        <Text style={{color: '#666666'}}>至少两种以上字符</Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}>
        <Ionicons
          style={{padding: 2}}
          size={18}
          color={
            isSubmitted ? (errors.verifyPassword ? 'red' : 'green') : 'grey'
          }
          name={
            errors.verifyPassword
              ? 'ios-close-circle-outline'
              : 'ios-checkmark-circle-outline'
          }
        />
        <Text style={{color: '#666666'}}>
          {errors.verifyPassword?.message || '确认密码必须一致'}
        </Text>
      </View>
      <Button
        disabled={!watch('password') && !watch('verifyPassword')}
        style={{
          width: '96%',
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 40,
        }}
        contentStyle={{width: '100%', height: '100%'}}
        labelStyle={{textAlign: 'center'}}
        mode="contained"
        buttonColor="#096BDE"
        onPress={handleSubmit(onSubmit)}>
        提交
      </Button>
      <Text style={{color: '#666666', padding: 20}}>
        Tips: 新密码不得与旧密码相同
      </Text>
    </View>
  );
};

export default ResetPasswordScreen;

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
