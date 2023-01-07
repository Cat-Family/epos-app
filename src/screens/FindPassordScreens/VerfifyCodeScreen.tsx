import React, { useState } from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Appbar, Button, Dialog, Paragraph, Portal } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TextInput } from 'react-native-gesture-handler'
import { FindPasswordNavigationProp } from '../../navigation/FindPasswordStack'
import { AuthNavigationProp } from '../../navigation/AuthStack'
import useTheme from '../../hooks/utils/useTheme'
import useResetPassord from '../../hooks/actions/useResetPassord'

const VerfifyCodeScreen = () => {
  const { theme, userColorScheme } = useTheme()
  const navigation = useNavigation<FindPasswordNavigationProp>()
  const authNavigation = useNavigation<AuthNavigationProp>()
  const [verifyCode, setVerifyCode] = useState('')
  const route = useRoute<any>()

  const {
    error,
    isLoading,
    countdown,
    dispatch,
    reSendCodeHandler,
    verifyCodeHandler
  } = useResetPassord()

  const _goBack = () => navigation.goBack()

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={userColorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Appbar.Header style={{ backgroundColor: '#F4F3F3' }}>
        <Appbar.BackAction onPress={() => _goBack()} />
        <Appbar.Content title="身份验证" titleStyle={{ fontSize: 18 }} />
      </Appbar.Header>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 18,
          width: '100%',
          height: 130
        }}
      >
        <Text
          style={[
            {
              fontWeight: '500',
              fontSize: 28,
              textAlign: 'left',
              borderRadius: 4,
              color: '#000'
            }
          ]}
        >
          {route.params?.method === 'phone' && '请输入短信验证码'}
          {route.params?.method === 'email' && '请填写邮件验证码'}
        </Text>
        <Text
          style={[
            {
              marginTop: 10,
              fontSize: 16,
              color: 'grey'
            }
          ]}
        >
          {`已向 ${route.params?.email || route.params?.phone} 发送验证码`}
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
          alignItems: 'center',
          backgroundColor: '#fff'
        }}
      >
        <Text
          style={[
            styles.text,
            {
              textAlign: 'center'
            }
          ]}
        >
          验证码
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1
            }
          ]}
          onChangeText={e => {
            setVerifyCode(e)
          }}
          value={verifyCode}
          placeholder="输入验证码"
          keyboardType="numeric"
        ></TextInput>
      </View>
      <TouchableOpacity
        disabled={countdown > 0}
        style={{ paddingLeft: 20, paddingTop: 10 }}
        onPress={reSendCodeHandler}
      >
        <Text style={styles.text}>
          {countdown === 0 ? `重新发送` : `已重新发送${countdown}`}
        </Text>
      </TouchableOpacity>
      <Button
        loading={isLoading}
        style={{
          width: '96%',
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 20
        }}
        contentStyle={{ width: '100%', height: '100%' }}
        labelStyle={{ textAlign: 'center' }}
        mode="contained"
        buttonColor="#096BDE"
        onPress={() => verifyCodeHandler(verifyCode)}
      >
        提交
      </Button>
      <Button
        style={{
          width: '96%',
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 20,
          borderColor: '#096BDE'
        }}
        contentStyle={{ width: '100%', height: '100%' }}
        labelStyle={{ textAlign: 'center', color: '#096BDE' }}
        mode="outlined"
        onPress={() => authNavigation.navigate('SignInScreen')}
      >
        立即登录
      </Button>

      <Portal>
        <Dialog
          visible={Boolean(error)}
          style={{
            backgroundColor: theme.colors.background
          }}
          onDismiss={() => {
            dispatch({ type: 'RESTORE' })
          }}
        >
          <Dialog.Icon icon="alert" color={theme.colors.error} />
          <Dialog.Title style={{ textAlign: 'center' }}>
            验证码错误
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>{error}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{ color: theme.colors.primary }}
              onPress={() => {
                dispatch({ type: 'RESTORE' })
              }}
            >
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default VerfifyCodeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3F3'
  },
  text: {
    color: '#000'
  },
  input: {
    width: 280,
    height: 58,
    borderWidth: 0,
    padding: 10,
    color: '#05375a',
    backgroundColor: '#fff',
    borderRadius: 4
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#fff'
  }
})
