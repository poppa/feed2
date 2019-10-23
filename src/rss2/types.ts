/**
 * Internal types for the RSS rendering
 */

import { ElementCompact } from 'xml-js'
import { Image, Item } from '../lib/types'
import { SetType, RequiredProps } from '../lib/ts-types'

export type EC = ElementCompact

export interface Rss extends EC {
  rss: EC & { channel: Channel; _attributes: EC }
}

interface Channel extends EC {
  title: EC
  link: EC
  description: EC
  lastBuildDate?: EC
  pubDate?: EC
  language?: EC
  generator?: EC
  docs?: EC
  image?: RssImage
  copyright?: EC
  category?: EC[]
  ttl?: EC
  item?: RssItem[]
}

export type RssImage = RequiredProps<
  SetType<Image, EC>,
  'title' | 'link' | 'url'
>
export type RssItem = SetType<Item, EC> & {
  pubDate?: EC
  enclosure?: EC
}

// export interface RssItem extends EC {
//   title?: EC
//   link?: EC
//   description?: EC
//   author?: EC
//   category?: EC[]
//   comments?: EC
//   enclosure?: EC
//   guid?: EC
//   pubDate?: EC
//   source?: EC
// }
