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
  useWindowDimensions
} from 'react-native'
import { Box, Text } from '@/atoms'
import AppContext from '@/app/context/AppContext'
const { useQuery } = AppContext

const StyledFlatList = createBox<
  Theme,
  AnimateProps<FlatListProps<Message & Realm.Object>>
>(Animated.FlatList)

interface Props {
  contentInsetTop: number
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onItemPress: (messageId: string) => void
  onItemLongPress: (messageId: string, isTop: boolean) => void
  onItemSwipeLeft: (messageId: string, cancel: () => void) => void
  onRefresh: () => void
  isLoading: boolean
}

const MessageList: React.FC<Props> = ({
  onScroll,
  contentInsetTop,
  onItemPress,
  onItemLongPress,
  onItemSwipeLeft,
  onRefresh,
  isLoading
}) => {
  const msgs = useQuery(Message)
  const { width, height } = useWindowDimensions()

  const renderItem = useCallback(
    ({ item }: { item: Message & Realm.Object }) => {
      return (
        <MessageListItem
          key={item._id}
          item={item}
          onLongPress={onItemLongPress}
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
      progressViewOffset={contentInsetTop}
      data={[
        ...msgs
          .filter(i => i.isTop)
          .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()),
        ...msgs
          .filter(i => !i.isTop)
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
      ]}
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
