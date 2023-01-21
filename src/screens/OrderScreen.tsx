import { CompositeScreenProps, useNavigation } from '@react-navigation/native'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
  useWindowDimensions
} from 'react-native'
import { Badge, Button } from 'react-native-paper'
import { Store } from '../app/models/Store'
import AppContext from '../app/context/AppContext'
import useTheme from '../hooks/utils/useTheme'
import { Auth } from '../app/models/Auth'
import useFetch from '../hooks/useFetch'
import { Message } from '@/app/models/Message'
import { Bar, Box, Container, Text, TouchableOpacity } from '@/atoms'
import HeaderBar from '@/components/header-bar'
import { FeatherIcon } from '@/components/icon'
import useStickyHeader from '@/hooks/use-sticky-header'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { HomeDrawerParamList, RootStackParamList } from '@/navigation/AppNavs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
const { useQuery } = AppContext

type Props = CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, 'Main'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function OrderScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions()
  const store = useQuery<Store & Realm.Object>(Store)
  const auth = useQuery(Auth)
  const messages = useQuery<Message & Realm.Object>(Message)
  const { theme, userColorScheme } = useTheme()
  const { fetchData } = useFetch()
  const [cateIndex, setCateIndex] = useState(0)
  const [refreshing, setRefreshing] = React.useState(false)
  const [products, setProducts] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  let tagRef = useRef<any>()
  const {
    handleMessageListLayout,
    handleScroll,
    headerBarStyle,
    headerBarHeight
  } = useStickyHeader()

  const handleSidebarToggle = useCallback(() => {
    navigation.toggleDrawer()
  }, [navigation])

  const getGoods = async () => {
    try {
      const res = await fetchData(
        '/goods/QueryGoodsList/magicApiJSON.do',
        'POST'
      )

      setProducts(res.info[auth[0].tenantId + 'goods'])
      setCateIndex(res.info[auth[0].tenantId + 'goods'][0].classCode)
    } catch (error) {
      console.log(error)
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    try {
      await getGoods()
    } catch (error: any) {
      console.error(error)
    }
    tagRef.current?.scrollTo({ x: 0, y: 0, animated: true })

    setRefreshing(false)
  }, [])

  useLayoutEffect(() => {
    getGoods()
  }, [])

  return (
    <Container flex={1}>
      <Bar
        variant={'headerBar'}
        flexDirection="row"
        alignItems="center"
        mx="lg"
        my="md"
        px="sm"
        minHeight={44}
      >
        <TouchableOpacity
          m="xs"
          p="xs"
          rippleBorderless
          onPress={handleSidebarToggle}
        >
          <FeatherIcon name="menu" size={24} />
        </TouchableOpacity>
        <Box flex={1} alignItems="center">
          <Text fontWeight="bold">{store[0].storeName}</Text>
        </Box>
        <TouchableOpacity
          m="xs"
          p="xs"
          rippleBorderless
          onPress={() => navigation.navigate('Message', {})}
        >
          <FeatherIcon name="message-circle" size={24} />
          <Badge size={16} style={{ position: 'absolute', top: 0 }}>
            {messages.length > 0
              ? messages.filter(item => !item?.isRead).length
              : 0}
          </Badge>
        </TouchableOpacity>
      </Bar>

      <View
        style={{
          backgroundColor: theme.colors.mainbackground
        }}
      >
        <ScrollView
          ref={tagRef}
          horizontal={true}
          contentContainerStyle={{
            backgroundColor: '#D5E3EF',
            height: 60,
            alignItems: 'center',
            padding: 2,
            width: width
          }}
        >
          {products?.map((item: any) => (
            <Button
              style={[
                { borderRadius: 6, height: 38, marginLeft: 10 },
                item.classCode === cateIndex
                  ? { backgroundColor: '#0077FF' }
                  : { backgroundColor: '#fff' }
              ]}
              contentStyle={[{ height: '100%' }]}
              onPress={() => setCateIndex(item.classCode)}
              key={item.classCode}
              labelStyle={
                item.classCode === cateIndex
                  ? { color: '#fff' }
                  : { color: '#0087FF' }
              }
              mode={
                item.classCode === cateIndex ? 'contained' : 'contained-tonal'
              }
            >
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
          backgroundColor: theme.colors.mainbackground
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={() => {
              !loading && onRefresh()
            }}
          />
        }
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
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
                  borderRadius: 7
                }}
                labelStyle={{
                  fontSize: 13,
                  color: '#0087FF'
                }}
                contentStyle={{ height: width * 0.18, width: width * 0.46 }}
                onPress={() => console.log('test')}
              >
                {item.goodsName}
              </Button>
            ))}
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24
  },
  badgeContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
