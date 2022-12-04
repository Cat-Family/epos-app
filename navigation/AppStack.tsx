import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import CustomDrawer from '../components/CustomDrawer';
import { AuthContext } from '../components/context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerStack from './DrawerStack';
import MessageScreen from '../screens/MessageScreen';


const AppStack = () => {
  const Stack = createNativeStackNavigator();
  const { signIn, theme, userInfo } = React.useContext<any>(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName="DrawerStack"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DrawerStack"
        component={DrawerStack}
      />
      <Stack.Screen
        name="MessageScreen"
        component={MessageScreen}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
