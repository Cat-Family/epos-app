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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useForm, Controller} from 'react-hook-form';
import {Button, Paragraph, Dialog, Portal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {AuthNavigationProp} from '../navigation/AuthStack';
import {AuthContext} from '../components/context';
import {object, string, TypeOf} from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import AppContext from '../app/context/AppContext';
import useAuth from '../hooks/actions/useAuth';

const SignInScreen = () => {
  const validationSchema = object({
    storeCode: string()
      .required('商家码不能为空')
      .matches(/^[A-Z]{4}$/, '商家码格式错误'),
    userName: string().required('用户名不能为空'),
    password: string().required('密码不能为空'),
  });

  type ValidationInput = TypeOf<typeof validationSchema>;

  const {theme} = React.useContext<any>(AuthContext);
  const {signInHandler, isLoading, error, dispatch} = useAuth();

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const navigation = useNavigation<AuthNavigationProp>();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ValidationInput>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (value: any) => {
    if (value.storeCode && value.userName && value.password) {
      signInHandler(value);
    }
  };

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#096BDE" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>欢迎!</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.background,
          },
        ]}>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: theme.colors.shadow,
                  },
                ]}>
                商家码
              </Text>
              <View style={styles.action}>
                <MaterialIcons
                  name="storefront"
                  color={theme.colors.secondary}
                  size={20}
                />
                <TextInput
                  placeholder="商家码"
                  placeholderTextColor="#666666"
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.secondary,
                    },
                  ]}
                  value={value}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
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
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: theme.colors.shadow,
                    marginTop: 24,
                  },
                ]}>
                用户名
              </Text>
              <View style={styles.action}>
                <FontAwesome
                  name="user-o"
                  color={theme.colors.secondary}
                  size={20}
                />
                <TextInput
                  placeholder="用户名"
                  placeholderTextColor="#666666"
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.secondary,
                    },
                  ]}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
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
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: theme.colors.shadow,
                    marginTop: 24,
                  },
                ]}>
                密码
              </Text>
              <View style={styles.action}>
                <Feather name="lock" color={theme.colors.secondary} size={20} />
                <TextInput
                  placeholder="密码"
                  placeholderTextColor="#666666"
                  secureTextEntry={secureTextEntry ? true : false}
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.secondary,
                    },
                  ]}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {!secureTextEntry ? (
                    <Feather name="eye" color="grey" size={20} />
                  ) : (
                    <Feather name="eye-off" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>{errors.password.message}</Text>
                </Animatable.View>
              )}
            </>
          )}
          name="password"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('FindPasswordStack')}>
          <Text style={{color: '#096BDE', marginTop: 15}}>忘记密码?</Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <Button
            loading={isLoading}
            style={{width: '100%', height: 50, borderRadius: 10}}
            contentStyle={{width: '100%', height: '100%'}}
            labelStyle={{textAlign: 'center'}}
            mode="contained"
            buttonColor="#096BDE"
            onPress={handleSubmit(onSubmit)}>
            登录
          </Button>

          <Button
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              borderWidth: 1,
              marginTop: 15,
              borderColor: '#096BDE',
            }}
            contentStyle={{width: '100%', height: '100%'}}
            labelStyle={{textAlign: 'center', color: '#096BDE'}}
            mode="outlined"
            onPress={() => navigation.navigate('SignUpScreen')}>
            注册商家
          </Button>
        </View>
      </Animatable.View>

      <Portal>
        <Dialog
          visible={Boolean(error)}
          style={{
            backgroundColor: theme.colors.background,
          }}
          onDismiss={() => {
            dispatch({type: 'RESTORE'});
          }}>
          <Dialog.Icon icon="alert" color={theme.colors.error} />
          <Dialog.Title style={{textAlign: 'center'}}>登录失败</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{error}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{color: theme.colors.primary}}
              onPress={() => {
                dispatch({type: 'RESTORE'});
              }}>
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
