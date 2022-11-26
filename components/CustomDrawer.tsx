import React, {FC} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {AuthContext} from './context';
import {Avatar} from 'react-native-paper';
import {CustomDefaultTheme} from '../app/theme';

interface IProps {}

const CustomDrawer: FC<IProps> = props => {
  const {signOut, userInfo, theme} = React.useContext<any>(AuthContext);

  return (
    <>
      <ImageBackground
        source={require('../assets/images/EPOS.png')}
        resizeMode="contain"
        style={{
          height: 120,
          padding: 10,
          backgroundColor: theme.colors.background,
          borderBottomRightRadius: 6,
          borderBottomLeftRadius: 6,
          shadowColor: theme.colors.shadow,
          shadowRadius: 10,
          shadowOpacity: 0.6,
          elevation: 8,
          shadowOffset: {
            width: 2,
            height: 4,
          },
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 28,
          }}>
          <Avatar.Text size={48} label={userInfo?.basicInfo?.userName} />
        </View>
      </ImageBackground>
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{
          padding: 4,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
        }}>
        <DrawerItem
          onPress={() => {
            signOut();
          }}
          icon={({color}) => (
            <Ionicons color={color} name="exit-outline" size={22} />
          )}
          label="退出登录"
        />
      </View>
    </>
  );
};

export default CustomDrawer;
