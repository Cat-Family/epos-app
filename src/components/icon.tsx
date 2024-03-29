import { Theme } from '@/themes'
import { ColorProps, useResponsiveProp, useTheme } from '@shopify/restyle'
import * as React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export type IconProps = React.ComponentProps<typeof Feather>
type Props = Omit<IconProps, 'color'> & ColorProps<Theme>

const FeatherIcon: React.FC<Props> = ({ color = '$foreground', ...rest }) => {
  const theme = useTheme<Theme>()
  const colorProp = useResponsiveProp(color)
  const vColor = theme.colors[colorProp || '$foreground']
  return <Feather {...rest} color={vColor} />
}

const OctIcon: React.FC<Props> = ({ color = '$foreground', ...rest }) => {
  const theme = useTheme<Theme>()
  const colorProp = useResponsiveProp(color)
  const vColor = theme.colors[colorProp || '$foreground']
  return <Octicons {...rest} color={vColor} />
}

const Ionicon: React.FC<Props> = ({ color = '$foreground', ...rest }) => {
  const theme = useTheme<Theme>()
  const colorProp = useResponsiveProp(color)
  const vColor = theme.colors[colorProp || '$foreground']
  return <Ionicons {...rest} color={vColor} />
}

const FontAwesomeIcon: React.FC<Props> = ({
  color = '$foreground',
  ...rest
}) => {
  const theme = useTheme<Theme>()
  const colorProp = useResponsiveProp(color)
  const vColor = theme.colors[colorProp || '$foreground']
  return <FontAwesome {...rest} color={vColor} />
}

const FontAwesome5Icon: React.FC<Props> = ({
  color = '$foreground',
  ...rest
}) => {
  const theme = useTheme<Theme>()
  const colorProp = useResponsiveProp(color)
  const vColor = theme.colors[colorProp || '$foreground']
  return <FontAwesome5 {...rest} color={vColor} />
}

const MaterialIcon: React.FC<Props> = ({ color = '$foreground', ...rest }) => {
  const theme = useTheme<Theme>()
  const colorProp = useResponsiveProp(color)
  const vColor = theme.colors[colorProp || '$foreground']
  return <MaterialIcons {...rest} color={vColor} />
}

const MaterialCommunityIcon: React.FC<Props> = ({
  color = '$foreground',
  ...rest
}) => {
  const theme = useTheme<Theme>()
  const colorProp = useResponsiveProp(color)
  const vColor = theme.colors[colorProp || '$foreground']
  return <MaterialCommunityIcons {...rest} color={vColor} />
}

export {
  FeatherIcon,
  OctIcon,
  FontAwesomeIcon,
  Ionicon,
  FontAwesome5Icon,
  MaterialIcon,
  MaterialCommunityIcon
}
