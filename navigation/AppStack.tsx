import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import CustomDrawer from '../components/CustomDrawer';
import {AuthContext} from '../components/context';

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const {signIn, theme, userInfo} = React.useContext<any>(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: userInfo?.storeInfo?.storeName,
        headerTintColor: theme.colors.onSurfaceVariant,
        headerStyle: {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.shadow,
          shadowRadius: 10,
          shadowOpacity: 0.6,
          elevation: 8,
          shadowOffset: {
            width: 2,
            height: 2,
          },
        },
        drawerStyle: theme.colors.outline,
      }}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerLabel: userInfo?.storeInfo?.storeName,
          drawerIcon: ({color}) => (
            <Fontisto
              name="shopping-store"
              size={22}
              color={theme.colors.primary}
            />
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
