import { Options as BaseOptions } from '../lib/options'
import { RequiredProps } from '../lib/ts-types'

export type Options = RequiredProps<
  BaseOptions,
  'title' | 'description' | 'link'
>
