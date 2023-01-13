import React, { useCallback, useRef, useState } from 'react'
import { Box, Container, Text, TouchableOpacity } from '@/atoms'
import MessageList from '@/components/message-list'
import HeaderBar from '@/components/header-bar'
import FeatherIcon from '@/components/icon'
import { CompositeScreenProps } from '@react-navigation/native'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { HomeDrawerParamList, RootStackParamList } from '@/navigation/AppNavs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useStickyHeader from '@/hooks/use-sticky-header'
import ActionMessageSheet from '@/components/action-message-sheet'
import { Message } from '@/app/models/Message'
import AppContext from '@/app/context/AppContext'
const { useQuery } = AppContext

type Props = CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, 'Message'>,
  NativeStackScreenProps<RootStackParamList>
>

function MessageScreen({ navigation }: Props) {
  const msgs = useQuery(Message)
  const refActionMessageSheet = useRef<ActionMessageSheet>(null)
  const {
    handleMessageListLayout,
    handleScroll,
    headerBarStyle,
    headerBarHeight
  } = useStickyHeader()
  const [concealMessageListItem, setConcealMessageListItem] = useState<
    (() => void) | null
  >(null)
  const handleSidebarToggle = useCallback(() => {
    navigation.toggleDrawer()
  }, [navigation])

  const handleMessageListItemSwipeLeft = useCallback(
    (messageId: string, conceal: () => void) => {
      const { current: menu } = refActionMessageSheet
      if (menu) {
        menu.setMessageId(messageId)
        menu.show()
        setConcealMessageListItem(() => conceal)
      }
    },
    [msgs]
  )
  const handleActionMessageSheetClose = useCallback(() => {
    const { current: menu } = refActionMessageSheet
    menu?.setMessageId('')
    if (concealMessageListItem) {
      concealMessageListItem()
    }
  }, [concealMessageListItem])

  const handleMessageListItemPress = useCallback(
    (messageId: string) => {
      const { current: menu } = refActionMessageSheet
      menu?.setMessageId(messageId)
      menu?.show()
    },
    [msgs, concealMessageListItem]
  )
  return (
    <Container justifyContent="center" alignItems="center">
      <MessageList
        contentInsetTop={headerBarHeight}
        onScroll={handleScroll}
        onItemPress={handleMessageListItemPress}
        onItemSwipeLeft={handleMessageListItemSwipeLeft}
      />

      <HeaderBar style={headerBarStyle} onLayout={handleMessageListLayout}>
        <TouchableOpacity
          m="xs"
          p="xs"
          rippleBorderless
          onPress={handleSidebarToggle}
        >
          <FeatherIcon name="menu" size={22} />
        </TouchableOpacity>
        <Box flex={1} alignItems="center">
          <Text fontWeight="bold">Message</Text>
        </Box>
        <TouchableOpacity m="xs" p="xs" rippleBorderless>
          <FeatherIcon name="more-vertical" size={22} />
        </TouchableOpacity>
      </HeaderBar>
      <ActionMessageSheet
        ref={refActionMessageSheet}
        onClose={handleActionMessageSheetClose}
      />
    </Container>
  )
}

export default MessageScreen
