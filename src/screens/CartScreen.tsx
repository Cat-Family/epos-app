import React, { useCallback } from 'react'
import { Bar, Box, Container, Text, TouchableOpacity } from '@/atoms'
import { FeatherIcon } from '@/components/icon'
import { CompositeScreenProps } from '@react-navigation/native'
import { HomeDrawerParamList, RootStackParamList } from '@/navigation/AppNavs'
import { TabParamList } from '@/navigation/TabNavigator'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Order'>,
  CompositeScreenProps<
    DrawerScreenProps<HomeDrawerParamList, 'Main'>,
    NativeStackScreenProps<RootStackParamList>
  >
>

function CartScreen({ navigation }: Props) {
  const handleSidebarToggle = useCallback(() => {
    navigation.toggleDrawer()
  }, [navigation])
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
          <Text fontWeight="bold">cart screen</Text>
        </Box>
        <TouchableOpacity
          m="xs"
          p="xs"
          rippleBorderless
          // onPress={() => navigation.navigate('Message', {})}
        ></TouchableOpacity>
      </Bar>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text>Cart Screen</Text>
      </Box>
    </Container>
  )
}

export default CartScreen
