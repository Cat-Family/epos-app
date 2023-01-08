import React, { useCallback } from 'react'
import { Message } from '@/app/models/Message'
import { Theme } from '@/themes'
import { createBox } from '@shopify/restyle'
import MessageListItem from './message-list-item'
import AppContext from '@/app/context/AppContext'
import Animated, { AnimateProps } from 'react-native-reanimated'
import {
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native'
import { Box } from '@/atoms'
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
      data={msgs}
      renderItem={renderItem}
      keyExtractor={item => item._id.toString()}
      width="100%"
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={<Box width="100%" height={contentInsetTop} />}
    />
  )
}

export default MessageList
