import React from 'react'
import { Container, SafeAreaView, Text } from '@/atoms'
import MessageList from '@/components/message-list-item'
import HeaderBar from '@/components/header-bar'

function MessageScreen() {
  return (
    <Container justifyContent="center" alignItems="center">
      <MessageList />
      <HeaderBar />
    </Container>
  )
}

export default MessageScreen
