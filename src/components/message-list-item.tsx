import React from 'react'
import { Message } from '@/app/models/Message'
import { Box, Text } from '@/atoms'
import { useWindowDimensions } from 'react-native'

const MessageListItem = ({ item }: { item: Message & Realm.Object }) => {
  const { width, height } = useWindowDimensions()
  return (
    <Box bg="$background" justifyContent="center" alignItems="center">
      <Box
        bg="$windowBackground"
        px="lg"
        py="sm"
        width={width * 0.97}
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
      </Box>
    </Box>
  )
}

export default MessageListItem
