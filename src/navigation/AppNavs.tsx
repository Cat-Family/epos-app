import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Sidebar from '../components/sidebar'
import { NavigatorScreenParams } from '@react-navigation/native'
import TabNavigator from './TabNavigator'
import MessageScreen from '@/screens/message'

export type HomeDrawerParamList = {
  Main: {}
  Message: {}
}

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeDrawerParamList>
  Detail: {
    defailId: string
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator<HomeDrawerParamList>()

const Home = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Message"
      screenOptions={{ drawerType: 'back', swipeEdgeWidth: 60 }}
      drawerContent={props => <Sidebar {...props} />}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Drawer.Screen
        name="Message"
        component={MessageScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  )
}

export default function Navigations() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
