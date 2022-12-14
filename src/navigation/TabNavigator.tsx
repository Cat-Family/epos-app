import React from 'react'
import OrderScreen from '../screens/OrderScreen'
import CartScreen from '../screens/CartScreen'
import FavoriteScreen from '../screens/FavoriteScreen'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import useTheme from '../hooks/utils/useTheme'

const Tab = createMaterialBottomTabNavigator()

const TabNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator activeColor={theme.colors.primary}>
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={({ route }) => ({
          tabBarLabel: '点餐',
          tabBarAccessibilityLabel: 'Order',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="cash-register"
              color={color}
              size={24}
            />
          )
        })}
      />
      <Tab.Screen
        name="Bill"
        component={CartScreen}
        options={{
          tabBarLabel: '账单',
          tabBarAccessibilityLabel: 'Bill',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="money-check-alt" color={color} size={24} />
          )
        }}
      />
      <Tab.Screen
        name="Assignment"
        component={FavoriteScreen}
        options={{
          tabBarLabel: '报表',
          tabBarAccessibilityLabel: 'Assignment',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="assignment" color={color} size={24} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
