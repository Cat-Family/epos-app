import React, {FC} from 'react';
import {View, ImageBackground} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from './context';
import {Avatar} from 'react-native-paper';
import useAuth from '../hooks/actions/useAuth';

interface IProps {}

const CustomDrawer: FC<IProps> = props => {
  const {userInfo, theme} = React.useContext<any>(AuthContext);
  const {signOutHandler} = useAuth();

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
            signOutHandler();
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
