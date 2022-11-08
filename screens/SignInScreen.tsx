import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useForm, Controller} from 'react-hook-form';

import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {AuthNavigationProp} from '../navigation/AuthStack';
import {AuthContext} from '../components/context';

const SignInScreen = () => {
  const {colors} = useTheme();
  const navigation = useNavigation<AuthNavigationProp>();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      storeCode: '',
      userName: '',
      password: '',
    },
  });
  const onSubmit = (data: {
    password: string;
    storeCode: string;
    userName: string;
  }) => console.log(data);

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const {signIn} = React.useContext(AuthContext);

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Controller
          control={control}
          rules={{
            required: true,
            maxLength: 4,
            minLength: 4,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: colors.shadow,
                  },
                ]}>
                商家码
              </Text>
              <View style={styles.action}>
                <MaterialIcons
                  name="storefront"
                  color={colors.secondary}
                  size={20}
                />
                <TextInput
                  placeholder="商家码"
                  placeholderTextColor="#666666"
                  style={[
                    styles.textInput,
                    {
                      color: colors.secondary,
                    },
                  ]}
                  value={value}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
                {!errors.userName ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="green" size={20} />
                  </Animatable.View>
                ) : null}
              </View>
              {errors.storeCode && (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>
                    {errors.storeCode.message}
                  </Text>
                </Animatable.View>
              )}
            </>
          )}
          name="storeCode"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: colors.shadow,
                    marginTop: 24,
                  },
                ]}>
                用户名
              </Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" color={colors.secondary} size={20} />
                <TextInput
                  placeholder="用户名"
                  placeholderTextColor="#666666"
                  style={[
                    styles.textInput,
                    {
                      color: colors.secondary,
                    },
                  ]}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {!errors.userName ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="green" size={20} />
                  </Animatable.View>
                ) : null}
              </View>
              {errors.userName && (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>{errors.userName.message}</Text>
                </Animatable.View>
              )}
            </>
          )}
          name="userName"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: colors.shadow,
                    marginTop: 24,
                  },
                ]}>
                密码
              </Text>
              <View style={styles.action}>
                <Feather name="lock" color={colors.secondary} size={20} />
                <TextInput
                  placeholder="密码"
                  placeholderTextColor="#666666"
                  secureTextEntry={secureTextEntry ? true : false}
                  style={[
                    styles.textInput,
                    {
                      color: colors.secondary,
                    },
                  ]}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {errors.password ? (
                    <Feather name="eye" color="grey" size={20} />
                  ) : (
                    <Feather name="eye-off" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>{errors.password.type}</Text>
                </Animatable.View>
              )}
            </>
          )}
          name="password"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('FindPasswordScreen')}>
          <Text style={{color: '#096BDE', marginTop: 15}}>忘记密码?</Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={handleSubmit(onSubmit)}>
            <LinearGradient
              colors={['#096BDE', '#3990FF']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                登录
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpScreen')}
            style={[
              styles.signIn,
              {
                borderColor: '#096BDE',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#096BDE',
                },
              ]}>
              注册商家
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#096BDE',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
