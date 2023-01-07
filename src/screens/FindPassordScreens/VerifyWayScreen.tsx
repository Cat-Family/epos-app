import React, { useState } from 'react'
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Appbar, Button, Dialog, Paragraph, Portal } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TextInput } from 'react-native-gesture-handler'
import { FindPasswordNavigationProp } from '../../navigation/FindPasswordStack'
import { AuthNavigationProp } from '../../navigation/AuthStack'
import useTheme from '../../hooks/utils/useTheme'
import useResetPassord from '../../hooks/actions/useResetPassord'

const VerifyWayScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>()
  const authNavigation = useNavigation<AuthNavigationProp>()
  const route = useRoute<any>()
  const [value, setValue] = useState<string>('')
  const { theme, userColorScheme } = useTheme()
  const _goBack = () => navigation.goBack()
  const { isLoading, error, dispatch, verifyWayHandler } = useResetPassord()

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
            styles.text,
            {
              fontWeight: '500',
              fontSize: 28,
              textAlign: 'left',
              borderRadius: 4
            }
          ]}
        >
          {route?.params?.method === 'phone' && '请填写手机号码'}
          {route?.params?.method === 'email' && '请填写邮件'}
        </Text>
        <Text
          style={[
            {
              textAlign: 'left',
              marginTop: 10,
              fontSize: 16,
              color: 'grey'
            }
          ]}
        >
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
            width: '94%'
          }
        ]}
        onChangeText={e => setValue(e)}
        value={value}
      />
      <Button
        disabled={Boolean(!value)}
        loading={isLoading}
        style={{
          width: 280,
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 40
        }}
        contentStyle={{ width: '100%', height: '100%' }}
        labelStyle={{ textAlign: 'center' }}
        mode="contained"
        buttonColor="#096BDE"
        onPress={() => {
          verifyWayHandler(value)
        }}
      >
        下一步
      </Button>
      <Button
        style={{
          width: 280,
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginTop: 14,
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
          <Dialog.Title style={{ textAlign: 'center' }}>验证失败</Dialog.Title>
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

export default VerifyWayScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3F3'
  },
  text: {
    color: '#000',
    marginTop: 5
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
