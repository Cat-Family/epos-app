import React, { useCallback } from 'react'
import { Message } from '@/app/models/Message'
import { Theme } from '@/themes'
import { createBox } from '@shopify/restyle'
import { FlatList, FlatListProps } from 'react-native'
import MessageListItem from './message-list'
import AppContext from '@/app/context/AppContext'
const { useQuery } = AppContext

const StyledFlatList = createBox<Theme, FlatListProps<Message & Realm.Object>>(
  FlatList
)

interface Props {}

const MessageList: React.FC<Props> = () => {
  const msgs = useQuery(Message)

  const renderItem = useCallback(
    ({ item }: { item: Message & Realm.Object }) => {
      return <MessageListItem key={item._id} item={item} />
    },
    [msgs]
  )

  return (
    <StyledFlatList
      contentInsetAdjustmentBehavior="automatic"
      data={msgs}
      renderItem={renderItem}
      keyExtractor={item => item._id.toString()}
      width="100%"
    />
  )
}

export default MessageList
