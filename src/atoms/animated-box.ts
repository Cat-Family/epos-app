import * as React from 'react'
import { Theme } from '@/themes'
import { createBox } from '@shopify/restyle'
import Animated, { AnimateProps } from 'react-native-reanimated'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

const AnimatedBox = createBox<Theme, AnimateProps<ViewProps>>(Animated.View)

export type AnimatedBoxProps = React.ComponentProps<typeof AnimatedBox>
export default AnimatedBox
