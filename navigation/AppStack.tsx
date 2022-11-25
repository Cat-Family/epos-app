import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import CustomDrawer from '../components/CustomDrawer';
import {AuthContext} from '../components/context';

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const {signIn, theme} = React.useContext<any>(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: '千渝掌柜',
        headerTintColor: theme.colors.onSurfaceVariant,
        headerStyle: {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.shadow,
        },
        drawerStyle: theme.colors.outline,
      }}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerLabel: '千渝掌柜',
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: '用户配置',
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: '应用设置',
          drawerIcon: ({color}) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
