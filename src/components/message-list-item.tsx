import React, { useCallback, useState } from 'react'
import { Message } from '@/app/models/Message'
import { Box, Text, TouchableOpacity } from '@/atoms'
import { useWindowDimensions } from 'react-native'
import MessageListItemActionView from './message-list-item-action-view'
import SwipeableView, { BackViewProps } from './swipeable-view'
import { FeatherIcon, OctIcon, FontAwesomeIcon } from './icon'
import formateDate from '@/utils/dateUtils'

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
      <Box bg="$windowBackground" >
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={handleLongPress}
          bg={'white'}
          px="lg"
          py="sm"
          style={{
            marginHorizontal: 10,
            marginVertical: 6,
            padding: 10,
            borderRadius: 10,
            flexDirection: 'row'
          }}
        >
          <Box flex={1}>
            <Text
              fontSize={13}
              fontWeight={item.isTop ? 'bold' : 'normal'}
              marginBottom="xs"
            >
              {`${item?.subject}`}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              fontSize={12}
              fontWeight={item.isTop ? 'bold' : 'normal'}
              opacity={item.isTop ? 0.8 : 1}
            >
              {item.content}
            </Text>
          </Box>
          <Box justifyContent="flex-start" alignItems="flex-end" marginLeft="md">
            <Box flexDirection="row" justifyContent="center" alignItems="center" marginBottom="xs">
              <Text fontSize={10} marginRight={"sm"}>{formateDate(item.createdAt)}</Text>
              {!item.isRead && <FontAwesomeIcon name='circle' color={"$primary"} size={8} />}
            </Box>
            {item.isTop && <OctIcon name='pin' color={"$primary"} />}
          </Box>
        </TouchableOpacity>
      </Box>
    </SwipeableView>
  )
}

export default MessageListItem
