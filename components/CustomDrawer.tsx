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
  const {signOut, userInfo} = React.useContext<any>(AuthContext);
  return (
    <>
      <ImageBackground
        style={{
          height: 120,
          padding: 20,
          backgroundColor: 'rgb(0, 94, 180)',
          borderBottomRightRadius: 6,
          borderBottomLeftRadius: 6,
        }}>
        <Avatar.Text size={40} label={userInfo?.basicInfo?.userName} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginRight: 5,
              color: '#fff',
            }}>
            {userInfo.storeInfo.storeName}
          </Text>
          <Fontisto name="shopping-store" size={14} color="#fff" />
        </View>
      </ImageBackground>
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#fff'}}>
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
