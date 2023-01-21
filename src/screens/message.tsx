import React, { useCallback, useRef, useState } from 'react'
import { Box, Container, Text, TouchableOpacity } from '@/atoms'
import MessageList from '@/components/message-list'
import HeaderBar from '@/components/header-bar'
import { FeatherIcon, Ionicon } from '@/components/icon'
import { CompositeScreenProps } from '@react-navigation/native'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { HomeDrawerParamList, RootStackParamList } from '@/navigation/AppNavs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useStickyHeader from '@/hooks/use-sticky-header'
import ActionMessageSheet from '@/components/action-message-sheet'
import { Message } from '@/app/models/Message'
import AppContext from '@/app/context/AppContext'
import useMessage from '@/hooks/actions/useMessage'
const { useQuery } = AppContext

type Props = NativeStackScreenProps<RootStackParamList>

function MessageScreen({ navigation }: Props) {
  const msgs = useQuery(Message)
  const {
    error,
    isLoading,
    dispatch,
    getMessagesHandler,
    readMessageHandler,
    topMessageHandler,
    unTopMessageHandler,
    deleteMessageHandler
  } = useMessage()
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

  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleMessageListItemSwipeLeft = useCallback(
    (messageId: string, conceal: () => void) => {
      navigation.navigate('MessageDetail', { messageId: Number(messageId) })
      setTimeout(() => {
        conceal()
      }, 1000)
    },
    [msgs]
  )

  const handleActionMessageSheetClose = useCallback(() => {
    if (concealMessageListItem) {
      concealMessageListItem()
    }
  }, [concealMessageListItem])

  const handleMessageListItemPress = useCallback(
    (messageId: string) => {
      navigation.navigate('MessageDetail', { messageId: Number(messageId) })
    },
    [msgs, navigation]
  )

  const handleMessageListItemLongPress = useCallback(
    (messageId: string, isTop: boolean) => {
      isTop
        ? unTopMessageHandler(Number(messageId))
        : topMessageHandler(Number(messageId))
    },
    [msgs]
  )

  const handleRefreshMessage = useCallback(() => getMessagesHandler(), [msgs])

  return (
    <Container justifyContent="center" alignItems="center">
      <MessageList
        isLoading={isLoading}
        onRefresh={handleRefreshMessage}
        contentInsetTop={headerBarHeight}
        onScroll={handleScroll}
        onItemPress={handleMessageListItemPress}
        onItemLongPress={handleMessageListItemLongPress}
        onItemSwipeLeft={handleMessageListItemSwipeLeft}
      />

      <HeaderBar style={headerBarStyle} onLayout={handleMessageListLayout}>
        <TouchableOpacity m="xs" p="xs" rippleBorderless onPress={handleBack}>
          <Ionicon name="arrow-back-sharp" size={22} />
        </TouchableOpacity>
        <Box flex={1} alignItems="center">
          <Text fontWeight="bold">通知消息</Text>
        </Box>
        <TouchableOpacity m="xs" p="xs" rippleBorderless>
          <FeatherIcon name="more-vertical" size={22} />
        </TouchableOpacity>
      </HeaderBar>
    </Container>
  )
}

export default MessageScreen
