import { Extension } from './extension'
import { Category } from './category'
import { Person } from './person'
import { Source } from './source'
import { GUID } from './guid'

export interface Item {
  title?: string
  link?: string
  description?: string
  author?: Person

  source?: Source
  category?: Category | Category[]
  extension?: Extension | Extension[]

  guid?: GUID
}
