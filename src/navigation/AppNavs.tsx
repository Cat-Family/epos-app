import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Sidebar from '../components/sidebar'
import {
  CardStyleInterpolators,
  HeaderStyleInterpolators,
  TransitionPresets,
  TransitionSpecs,
  createStackNavigator
} from '@react-navigation/stack'
import { NavigatorScreenParams } from '@react-navigation/native'
import TabNavigator from './TabNavigator'
import MessageScreen from '@/screens/message'
import MessageDetail from '@/screens/message-detail'

export type HomeDrawerParamList = {
  Main: {}
}

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeDrawerParamList>
  Message: {}
  MessageDetail: {
    messageId: number
  }
}

const NativeStack = createStackNavigator<RootStackParamList>()

const Drawer = createDrawerNavigator<HomeDrawerParamList>()

const Home = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={{ drawerType: 'back', swipeEdgeWidth: 60 }}
      drawerContent={props => <Sidebar {...props} />}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  )
}

export default function Navigations() {
  return (
    <NativeStack.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS
      })}
    >
      <NativeStack.Screen name="Home" component={Home} />
      <NativeStack.Screen name="Message" component={MessageScreen} />
      <NativeStack.Screen
        name="MessageDetail"
        initialParams={{ messageId: 0 }}
        component={MessageDetail}
      />
    </NativeStack.Navigator>
  )
}
