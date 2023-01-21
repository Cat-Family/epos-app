import * as React from 'react'
import { Bar, Box, Container, Text, TouchableOpacity } from '@/atoms'
import HeaderBar from '@/components/header-bar'
import { Ionicon, FeatherIcon } from '@/components/icon'
import { RootStackParamList } from '@/navigation/AppNavs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { WebView } from 'react-native-webview'
import AppContext from '@/app/context/AppContext'
import { Message } from '@/app/models/Message'
const { useObject } = AppContext
type Props = NativeStackScreenProps<RootStackParamList, 'MessageDetail'>

function MessageDetail({ navigation, route }: Props) {
  const handleBack = React.useCallback(() => {
    navigation.goBack()
  }, [navigation])
  const message = useObject<Message & Realm.Object>(
    'Message',
    Number(route.params.messageId)
  )

  return (
    <Container flex={1}>
      <Bar
        variant={'headerBar'}
        flexDirection="row"
        alignItems="center"
        mx="lg"
        my="md"
        px="sm"
        minHeight={44}
      >
        <TouchableOpacity m="xs" p="xs" rippleBorderless onPress={handleBack}>
          <Ionicon name="arrow-back-sharp" size={22} />
        </TouchableOpacity>
        <Box flex={1} alignItems="center">
          <Text fontWeight="bold">{message?.subject}</Text>
        </Box>
        <TouchableOpacity m="xs" p="xs" rippleBorderless>
          <FeatherIcon name="more-vertical" size={22} />
        </TouchableOpacity>
      </Bar>
      {!message?.isHtml ? (
        <Box paddingHorizontal="lg">
          <Text textAlign="center">{message?.createdAt.toLocaleString()}</Text>
          <Text
            textAlign="left"
            fontWeight="normal"
            fontSize={14}
          >{`    ${message?.content}`}</Text>
        </Box>
      ) : (
        <WebView source={{ uri: 'https://reactnative.dev/' }} />
      )}
    </Container>
  )
}

export default MessageDetail
