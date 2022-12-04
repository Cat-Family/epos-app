import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Appbar, Badge, Button, FAB, Portal } from 'react-native-paper';
import { AuthContext } from '../components/context';
import axiosInstance from '../utils/request';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CryptoJS from 'crypto-js';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function OrderScreen() {
  const { theme, isDarkTheme, authInfo } = React.useContext<any>(AuthContext);
  const [cateIndex, setCateIndex] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [products, setProducts] = useState<any>();
  let tagRef = useRef<any>()
  const navigation = useNavigation();

  const getGoods = async () => {
    try {
      const { data } = await axiosInstance.post(
        '/goods/QueryGoodsList/magicApiJSON.do',
        {
          authInfo: {
            ...authInfo,
            reqTime: new Date().getTime(),
            reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
          },
        },
      );
      setProducts(data.info[authInfo.tenantId + 'goods']);
      setCateIndex(data.info[authInfo.tenantId + 'goods'][0].classCode);
    } catch (error: any) {
      console.log(error);
    }
  };

  const onRefresh = React.useCallback(async () => {

    setRefreshing(true);
    await getGoods();
    tagRef.current?.scrollTo({ x: 0, y: 0, animated: true })

    setRefreshing(false);
  }, []);

  useLayoutEffect(() => {
    getGoods();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        display: 'flex',
        flexDirection: 'row',
      }}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
      />
      <View style={{ display: 'flex', width: '100%', height: '100%' }}>
        <Appbar.Header style={{
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.shadow,
          shadowRadius: 10,
          shadowOpacity: 0.6,
          elevation: 8,
          shadowOffset: {
            width: 2,
            height: 2,
          },
        }}>
          <Appbar.Action icon="menu" onPress={() => { navigation.toggleDrawer() }} />
          <Appbar.Content title="点餐" />
          <View style={styles.badgeContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
              <AntDesign
                name="message1"
                color={theme.colors.secondary}
                size={26} />
            </TouchableOpacity>
            <Badge
              size={20}
              style={{ top: 0, position: 'absolute' }}
            >21</Badge>
          </View>
        </Appbar.Header>
        <View>
          <ScrollView
            ref={tagRef}
            horizontal={true}
            contentContainerStyle={{
              backgroundColor: '#D5E3FF',
              height: 60,
              alignItems: 'center',
              padding: 2,
            }}>
            {products?.map((item: any) => (
              <Button
                style={[{ borderRadius: 6, height: 38, marginLeft: 10 },
                item.classCode === cateIndex ?
                  { backgroundColor: '#0087FF' }
                  : { backgroundColor: '#fff' }]}
                contentStyle={[{ height: '100%' }]}
                onPress={() => setCateIndex(item.classCode)}
                key={item.classCode}
                labelStyle={
                  item.classCode === cateIndex
                    ? { color: '#fff' }
                    : { color: '#0087FF' }
                }
                mode={
                  item.classCode === cateIndex
                    ? 'contained'
                    : 'contained-tonal'
                }>
                {item.className}
              </Button>
            ))}
          </ScrollView>
        </View>
        <ScrollView
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: theme.colors.mainbackground,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
          }}>
          {products &&
            products
              ?.filter((item: any) => item.classCode === cateIndex)[0]
              ?.goods?.map((item: any) => (
                <Button
                  mode="elevated"
                  key={item.goodsCode}
                  style={{ margin: 5 }}
                  labelStyle={
                    {
                      fontSize: 13,
                    }
                  }
                  contentStyle={{ width: 124, height: 124 }}
                  onPress={() => console.log('test')}>
                  {item.goodsName}
                </Button>
              ))}
        </ScrollView>
      </View>


    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
  badgeContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
