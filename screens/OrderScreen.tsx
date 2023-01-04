import {useNavigation} from '@react-navigation/native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {Appbar, Badge, Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Store} from '../app/models/Store';
import AppContext from '../app/context/AppContext';
import useTheme from '../hooks/utils/useTheme';
import {Auth} from '../app/models/Auth';
import useFetch from '../hooks/useFetch';
const {useQuery} = AppContext;

const {width, height} = Dimensions.get('screen');

export default function OrderScreen() {
  const store = useQuery(Store);
  const auth = useQuery(Auth);
  const {theme, userColorScheme} = useTheme();
  const {fetchData} = useFetch();

  const [cateIndex, setCateIndex] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [products, setProducts] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  let tagRef = useRef<any>();
  const navigation = useNavigation();

  const getGoods = async () => {
    try {
      const res = await fetchData(
        '/goods/QueryGoodsList/magicApiJSON.do',
        'POST',
      );

      setProducts(res.info[auth[0].tenantId + 'goods']);
      setCateIndex(res.info[auth[0].tenantId + 'goods'][0].classCode);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await getGoods();
    } catch (error: any) {
      console.error(error);
    }
    tagRef.current?.scrollTo({x: 0, y: 0, animated: true});

    setRefreshing(false);
  }, []);

  useLayoutEffect(() => {
    getGoods();
  }, []);

  return (
    <>
        <Appbar.Header
          style={{
            backgroundColor: theme.colors.background,
          }}>
          <Appbar.Action
            icon="menu"
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
          <Appbar.Content title={store[0]?.storeName} />
          <TouchableOpacity
            onPress={() => navigation.navigate('MessageScreen')}>
            <View style={styles.badgeContainer}>
              <AntDesign
                name="message1"
                color={theme.colors.secondary}
                size={26}
              />
              <Badge size={20} style={{top: 0, position: 'absolute'}}>
                21
              </Badge>
            </View>
          </TouchableOpacity>
        </Appbar.Header>
        <View
          style={{
            backgroundColor: theme.colors.mainbackground,
          }}>
          <ScrollView
            ref={tagRef}
            horizontal={true}
            contentContainerStyle={{
              backgroundColor: '#D5E3EF',
              height: 60,
              alignItems: 'center',
              padding: 2,
            }}>
            {products?.map((item: any) => (
              <Button
                style={[
                  {borderRadius: 6, height: 38, marginLeft: 10},
                  item.classCode === cateIndex
                    ? {backgroundColor: '#0077FF'}
                    : {backgroundColor: '#fff'},
                ]}
                contentStyle={[{height: '100%'}]}
                onPress={() => setCateIndex(item.classCode)}
                key={item.classCode}
                labelStyle={
                  item.classCode === cateIndex
                    ? {color: '#fff'}
                    : {color: '#0087FF'}
                }
                mode={
                  item.classCode === cateIndex ? 'contained' : 'contained-tonal'
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
            paddingTop: 10,
            backgroundColor: theme.colors.mainbackground,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || loading}
              onRefresh={() => {
                !loading && onRefresh();
              }}
            />
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
                  style={{
                    margin: width * 0.02,
                    backgroundColor: '#fff',
                    borderRadius: 7,
                  }}
                  labelStyle={{
                    fontSize: 13,
                    color: '#0087FF',
                  }}
                  contentStyle={{height: width * 0.18, width: width * 0.46}}
                  onPress={() => console.log('test')}>
                  {item.goodsName}
                </Button>
              ))}
        </ScrollView>
    </>
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
    alignItems: 'center',
  },
});
