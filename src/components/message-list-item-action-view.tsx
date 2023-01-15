import { AnimatedBox, Box } from '@/atoms'
import React from 'react'
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import {FeatherIcon} from './icon'

interface Props {
  progress: Readonly<SharedValue<number>>
}

const MessageListItemActionView: React.FC<Props> = ({ progress }) => {
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: progress.value
      }
    ]
  }))

  return (
    <Box
      flex={1}
      bg="$mainDelete"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      pr="xl"
      px="lg"
      py="sm"
      style={{
        marginHorizontal: 10,
        marginVertical: 6,
        padding: 10,
        borderRadius: 10
      }}
    >
      <AnimatedBox flexDirection="row" alignItems="center" style={iconStyle}>
        <FeatherIcon name="trash-2" color="white" size={22} />
        <FeatherIcon name="arrow-left" color="white" size={15} />
      </AnimatedBox>
    </Box>
  )
}

export default MessageListItemActionView
