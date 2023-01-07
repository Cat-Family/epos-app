import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DrawerStack from './DrawerStack'
import MessageScreen from '../screens/MessageScreen'

const AppStack = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName="DrawerStack"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="DrawerStack" component={DrawerStack} />
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
    </Stack.Navigator>
  )
}

export default AppStack
