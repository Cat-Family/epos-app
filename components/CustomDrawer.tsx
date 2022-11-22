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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {AuthContext} from './context';

interface IProps {}

const CustomDrawer: FC<IProps> = props => {
  const {signOut} = React.useContext(AuthContext);

  return (
    <>
      <ImageBackground
        //   source={require('../assets/images/menu-bg.jpeg')}
        style={{padding: 20, backgroundColor: 'rgb(0, 94, 180)'}}>
        <Image
          // source={require('../assets/images/user-profile.jpg')}
          style={{height: 80, width: 80, borderRadius: 40}}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontFamily: 'Roboto-Medium',
            // marginBottom: 5,
          }}>
          John Doe
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: '#fff',
              fontFamily: 'Roboto-Regular',
              marginRight: 5,
            }}>
            280 Coins
          </Text>
          <FontAwesome5 name="coins" size={14} color="#fff" />
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
          label="Tell a Friend"
          onPress={() => console.log('re')}
        />
        <DrawerItem
          onPress={() => {
            signOut();
          }}
          icon={({color}) => (
            <Ionicons color={color} name="exit-outline" size={22} />
          )}
          label="Tell a Friend"
        />
      </View>
    </>
  );
};

export default CustomDrawer;
