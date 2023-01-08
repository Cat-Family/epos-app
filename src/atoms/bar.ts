import { Theme } from '@/themes'
import {
  VariantProps,
  createRestyleComponent,
  createVariant
} from '@shopify/restyle'
import Box, { BoxProps } from './box'

const Bar = createRestyleComponent<
  VariantProps<Theme, 'barVariants'> & BoxProps,
  Theme
>([createVariant({ themeKey: 'barVariants' })], Box)

export default Bar
