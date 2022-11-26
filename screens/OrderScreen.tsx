import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useLayoutEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {Button, FAB, Portal} from 'react-native-paper';
import {AuthContext} from '../components/context';
import axiosInstance from '../utils/request';
import CryptoJS from 'crypto-js';

export default function OrderScreen() {
  const {theme, isDarkTheme, authInfo} = React.useContext<any>(AuthContext);
  const [cateIndex, setCateIndex] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [products, setProducts] = useState<any>();

  const getGoods = async () => {
    try {
      const {data} = await axiosInstance.post(
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
      <ScrollView
        style={{
          width: 140,
          borderRightWidth: 1,
          borderColor: theme.colors.outlineVariant,
        }}
        contentContainerStyle={{
          backgroundColor: theme.colors.surface,
        }}>
        {products?.map((item: any) => (
          <Button
            style={{marigin: 5}}
            contentStyle={[{height: 70}]}
            onPress={() => setCateIndex(item.classCode)}
            key={item.classCode}
            labelStyle={
              item.classCode === cateIndex
                ? {color: theme.colors.primary}
                : {color: theme.colors.secondary}
            }
            mode="text">
            {item.className}
          </Button>
        ))}
      </ScrollView>
      <ScrollView
        style={{
          backgroundColor: theme.colors.background,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {products &&
          products
            ?.filter((item: any) => item.classCode === cateIndex)[0]
            ?.goods?.map((item: any) => (
              <Button
                mode="elevated"
                key={item.goodsCode}
                style={{margin: 5}}
                labelStyle={
                  {
                    // fontSize: 12,
                  }
                }
                contentStyle={{width: 134, height: 134}}
                onPress={() => console.log('test')}>
                {item.goodsName}
              </Button>
            ))}
      </ScrollView>
    </SafeAreaView>
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
});
