import React from 'react'
import OrderScreen from '../screens/OrderScreen'
import CartScreen from '../screens/CartScreen'
import FavoriteScreen from '../screens/FavoriteScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  FontAwesome5Icon,
  MaterialCommunityIcon,
  MaterialIcon
} from '@/components/icon'
import { CompositeScreenProps } from '@react-navigation/native'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { HomeDrawerParamList, RootStackParamList } from './AppNavs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type TabParamList = {
  Order: {}
  Bill: {}
  Assignment: {}
}

const Tab = createBottomTabNavigator<TabParamList>()

type Props = CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, 'Main'>,
  NativeStackScreenProps<RootStackParamList>
>

function TabNavigator({ navigation, route }: Props) {
  return (
    <Tab.Navigator
      initialRouteName="Order"
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={({ route, navigation }) => ({
          tabBarLabel: '点餐',
          tabBarAccessibilityLabel: 'Order',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcon
              name="cash-register"
              color={navigation.isFocused() ? '$primary' : '$sidebarForeground'}
              size={24}
            />
          )
        })}
      />
      <Tab.Screen
        name="Bill"
        component={CartScreen}
        options={({ route, navigation }) => ({
          tabBarLabel: '账单',
          tabBarAccessibilityLabel: 'Bill',
          tabBarIcon: ({ color }) => (
            <FontAwesome5Icon
              name="money-check-alt"
              color={navigation.isFocused() ? '$primary' : '$sidebarForeground'}
              size={24}
            />
          )
        })}
      />
      <Tab.Screen
        name="Assignment"
        component={FavoriteScreen}
        options={({ route, navigation }) => ({
          tabBarLabel: '报表',
          tabBarAccessibilityLabel: 'Assignment',
          tabBarIcon: ({ color }) => (
            <MaterialIcon
              name="assignment"
              color={navigation.isFocused() ? '$primary' : '$sidebarForeground'}
              size={24}
            />
          )
        })}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
