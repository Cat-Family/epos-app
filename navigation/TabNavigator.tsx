import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import FavoriteScreen from '../screens/FavoriteScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Route} from '@react-navigation/routers';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={
        {
          // headerShown: false,
          // tabBarShowLabel: false,
          // tabBarStyle: {backgroundColor: '#AD40AF'},
          // tabBarInactiveTintColor: '#fff',
          // tabBarActiveTintColor: 'yellow',
        }
      }>
      <Tab.Screen
        name="Home2"
        component={HomeStack}
        options={({route}) => ({
          tabBarStyle: {
            // display: getTabBarVisibility(route),
            // backgroundColor: '#AD40AF',
          },
          tabBarIcon: ({color}) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
        })}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: 3,
          // tabBarBadgeStyle: {backgroundColor: 'yellow'},
          tabBarIcon: ({color}) => (
            <Feather name="shopping-bag" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="heart-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
