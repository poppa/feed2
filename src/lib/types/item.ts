import { Extension } from './extension'
import { Category } from './category'
import { Person } from './person'
import { Source } from './source'
import { GUID } from './guid'
import { Media } from './media'

export interface Item {
  id?: GUID | string
  title?: string
  link?: string
  description?: string
  content?: string
  author?: Person
  date?: Date

  media?: Media | Media[]

  source?: Source
  category?: Category | Category[]
  extension?: Extension | Extension[]
  comments?: string
}
