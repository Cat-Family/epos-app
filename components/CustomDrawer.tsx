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
        style={{
          height: 120,
          padding: 20,
          backgroundColor: theme.colors.primaryContainer,
          borderBottomRightRadius: 6,
          borderBottomLeftRadius: 6,
        }}>
        <Avatar.Text size={40} label={userInfo?.basicInfo?.userName} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text
            style={{
              marginRight: 5,
              color: theme.colors.primary,
            }}>
            {userInfo?.storeInfo?.storeName}
          </Text>
          <Fontisto
            name="shopping-store"
            size={14}
            color={theme.colors.primary}
          />
        </View>
      </ImageBackground>
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
        }}>
        <DrawerItem
          icon={({color}) => (
            <Ionicons color={color} name="share-social-outline" size={22} />
          )}
          label="分享APP"
          onPress={() => console.log('re')}
        />
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
