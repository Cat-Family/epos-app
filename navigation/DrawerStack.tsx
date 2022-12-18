import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import CustomDrawer from '../components/CustomDrawer';
import {AuthContext} from '../components/context';
import AppContext from '../app/context/AppContext';
import {Store} from '../app/models/Store';
const {useQuery} = AppContext;

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  const {theme} = React.useContext<any>(AuthContext);
  const store = useQuery(Store);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerLabel: store[0]?.storeName,
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

export default DrawerStack;
