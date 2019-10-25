import { Extension } from './extension'
import { Category } from './category'
import { Person } from './person'
import { Source } from './source'
import { GUID } from './guid'
import { Media } from './media'
import { Text } from './text'

export interface Item {
  id?: GUID | string
  title?: Text
  link?: string
  description?: Text
  content?: Text
  author?: Person
  date?: Date

  media?: Media | Media[]

  source?: Source
  category?: Category | Category[]
  extension?: Extension | Extension[]
  comments?: string
}
