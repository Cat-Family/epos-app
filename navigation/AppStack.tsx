import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

// import CustomDrawer from '../components/CustomDrawer';

import Ionicons from 'react-native-vector-icons/Ionicons';

import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

import TabNavigator from './TabNavigator';
import CustomDrawer from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {},
      }}>
      <Drawer.Screen
        name="千渝掌柜"
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
