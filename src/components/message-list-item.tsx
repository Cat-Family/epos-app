import React, { useCallback } from 'react'
import { Message } from '@/app/models/Message'
import { Box, Text, TouchableOpacity } from '@/atoms'
import { useWindowDimensions } from 'react-native'
import MessageListItemActionView from './message-list-item-action-view'
import SwipeableView, { BackViewProps } from './swipeable-view'

const MessageListItem = ({
  item,
  onLongPress,
  onPress,
  onSwipeLeft
}: {
  item: Message & Realm.Object
  onPress: (messageId: string) => void
  onLongPress: (messageId: string, isTop: boolean) => void
  onSwipeLeft?: (messageId: string, done: () => void) => void
}) => {
  const { width, height } = useWindowDimensions()

  const handlePress = useCallback(() => {
    onPress(item._id.toString())
  }, [item._id, onPress])

  const handleLongPress = useCallback(() => {
    onLongPress(item._id.toString(), item.isTop)
  }, [item._id, onLongPress])

  const handleSwipeLeft = useCallback(
    (done: () => void) => {
      onSwipeLeft && onSwipeLeft(item._id.toString(), done)
    },
    [item._id, onSwipeLeft]
  )

  const renderBackView = useCallback(
    ({ progress }: BackViewProps) => (
      <MessageListItemActionView progress={progress} />
    ),
    []
  )
  return (
    <SwipeableView onSwipeLeft={handleSwipeLeft} backView={renderBackView}>
      <Box bg="$windowBackground">
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={handleLongPress}
          bg={item.isTop ? 'red' : '$windowBackground'}
          px="lg"
          py="sm"
          style={{
            marginHorizontal: 10,
            marginVertical: 6,
            padding: 10,
            borderRadius: 10
          }}
        >
          <Text style={{}}>{`${item?.subject}`}</Text>
          <Text fontSize={14}>{item.createdAt.toUTCString()}</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            fontSize={14}
            opacity={0.7}
          >
            {item.content}
          </Text>
        </TouchableOpacity>
      </Box>
    </SwipeableView>
  )
}

export default MessageListItem
