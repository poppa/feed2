import { Media } from './media'

export type Image = Pick<Media, 'url' | 'width' | 'height'> & {
  title?: string
  link?: string
  description?: string
}
