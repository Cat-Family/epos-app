import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { List } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FindPasswordNavigationProp } from '../../navigation/FindPasswordStack'
import { AuthNavigationProp } from '../../navigation/AuthStack'
import useTheme from '../../hooks/utils/useTheme'

const FindPasswordWayScreen = () => {
  const navigation = useNavigation<FindPasswordNavigationProp>()
  const authNavigation = useNavigation<AuthNavigationProp>()
  const { theme, userColorScheme } = useTheme()

  const route = useRoute<any>()
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={userColorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Appbar.Header style={{ backgroundColor: '#F4F3F3' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="身份验证" titleStyle={{ fontSize: 18 }} />
      </Appbar.Header>

      <MaterialCommunityIcons
        style={{
          textAlign: 'center',
          marginTop: 36
        }}
        name="shield-account-outline"
        color="#34B73FBA"
        size={64}
      ></MaterialCommunityIcons>
      <Text
        style={[
          styles.text,
          {
            textAlign: 'center',
            marginTop: 34,
            fontSize: 24,
            fontWeight: '500'
          }
        ]}
      >
        身份验证
      </Text>
      <Text
        style={[
          { textAlign: 'center', marginTop: 10, fontSize: 12, color: 'grey' }
        ]}
      >
        为了保护你的账号安全，验证通过后即可找回你的密码。
      </Text>
      <List.Section style={{ paddingTop: 20 }}>
        {route.params?.phone && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('VerifyWayScreen', {
                method: 'phone',
                phone: route.params.phone,
                userName: route.params.userName
              })
            }
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 80,
              borderRadius: 4,
              alignSelf: 'center',
              marginTop: 10
            }}
          >
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
              height: 80,
              borderRadius: 4,
              alignSelf: 'center',
              marginTop: 10
            }}
          >
            <List.Item
              onPress={() =>
                navigation.navigate('VerifyWayScreen', {
                  method: 'email',
                  email: route.params.emailAddr,
                  userName: route.params.userName
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
      <View style={{ flex: 1 }} />
      <Button
        style={{
          width: 280,
          height: 58,
          borderRadius: 4,
          alignSelf: 'center',
          marginBottom: 24,
          borderColor: '#096BDE'
        }}
        contentStyle={{ width: '100%', height: '100%' }}
        labelStyle={{ textAlign: 'center', color: '#096BDE' }}
        mode="outlined"
        onPress={() => authNavigation.navigate('SignInScreen')}
      >
        立即登录
      </Button>
    </View>
  )
}

export default FindPasswordWayScreen

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
