import React from 'react'
import { Container, SafeAreaView, Text } from '@/atoms'
import MessageList from '@/components/message-list-item'

function MessageScreen() {
  return (
    <Container justifyContent="center" alignItems="center">
      <MessageList />
    </Container>
  )
}

export default MessageScreen
