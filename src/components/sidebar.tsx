import { Box, SafeAreaView, Text, Touchable } from '@/atoms'
import useAuth from '@/hooks/actions/useAuth'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import React from 'react'
import { Ionicon } from './icon'

const Sidebar: React.FC<DrawerContentComponentProps> = () => {
  const { signOutHandler } = useAuth()

  return (
    <Box flex={1} bg="$sidebarBackground">
      <SafeAreaView flex={1}>
        <Text variant="sidebar" m="lg">
          千渝掌柜
        </Text>

        <Box flex={1} />
        <Touchable
          m="xs"
          p="xs"
          rippleBorderless
          justifyContent="center"
          alignItems="center"
          flexDirection="row"
          onPress={() => {
            signOutHandler()
          }}
        >
          <Ionicon
            name="exit-outline"
            color="$fieldInputPlaceholderTextColor"
            size={22}
          />
          <Text color="$fieldInputPlaceholderTextColor" m="sm">
            退出登录
          </Text>
        </Touchable>
      </SafeAreaView>
    </Box>
  )
}

export default Sidebar
