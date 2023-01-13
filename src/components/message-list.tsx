import React, { useCallback } from 'react'
import { Message } from '@/app/models/Message'
import { Theme } from '@/themes'
import { createBox } from '@shopify/restyle'
import MessageListItem from './message-list-item'
import Animated, { AnimateProps } from 'react-native-reanimated'
import {
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  useWindowDimensions
} from 'react-native'
import { Box, Text } from '@/atoms'
import AppContext from '@/app/context/AppContext'
import useMessage from '@/hooks/actions/useMessage'
const { useQuery } = AppContext

const StyledFlatList = createBox<
  Theme,
  AnimateProps<FlatListProps<Message & Realm.Object>>
>(Animated.FlatList)

interface Props {
  contentInsetTop: number
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onItemPress: (messageId: string) => void
  onItemSwipeLeft: (messageId: string, cancel: () => void) => void
}

const MessageList: React.FC<Props> = ({
  onScroll,
  contentInsetTop,
  onItemPress,
  onItemSwipeLeft
}) => {
  const msgs = useQuery(Message)
  const { isLoading, getMessagesHandler } = useMessage()
  const { width, height } = useWindowDimensions()

  const onRefresh = async () => {
    getMessagesHandler(true, true)
  }
  const renderItem = useCallback(
    ({ item }: { item: Message & Realm.Object }) => {
      return (
        <MessageListItem
          key={item._id}
          item={item}
          onPress={onItemPress}
          onSwipeLeft={onItemSwipeLeft}
        />
      )
    },
    [msgs, onItemPress, onItemSwipeLeft]
  )

  return (
    <StyledFlatList
      contentInsetAdjustmentBehavior="automatic"
      width="100%"
      data={msgs}
      onScroll={onScroll}
      onRefresh={onRefresh}
      refreshing={isLoading}
      renderItem={renderItem}
      keyExtractor={item => item._id.toString()}
      scrollEventThrottle={16}
      ListEmptyComponent={
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
          height={height - contentInsetTop}
          bg={'red'}
        >
          <Text>Empty Message!</Text>
        </Box>
      }
      ListHeaderComponent={<Box width="100%" height={contentInsetTop} />}
      ListFooterComponent={<Box width="100%" height={24} />}
    />
  )
}

export default MessageList
