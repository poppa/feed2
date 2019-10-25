/**
 * Internal types for the RSS rendering
 */

import { ElementCompact } from 'xml-js'
import { Image, Item } from '../lib/types'
import { SetType, RequiredProps } from '../lib/ts-types'

export interface Rss extends ElementCompact {
  rss: ElementCompact & { channel: Channel; _attributes: ElementCompact }
}

export interface Channel extends ElementCompact {
  title: ElementCompact
  link: ElementCompact
  description: ElementCompact
  lastBuildDate?: ElementCompact
  pubDate?: ElementCompact
  language?: ElementCompact
  generator?: ElementCompact
  docs?: ElementCompact
  image?: RssImage
  copyright?: ElementCompact
  category?: ElementCompact[]
  ttl?: ElementCompact
  item?: RssItem[]
}

export type RssImage = RequiredProps<
  SetType<Image, ElementCompact>,
  'title' | 'link' | 'url'
>

export type RssItem = SetType<Item, ElementCompact> & {
  pubDate?: ElementCompact
  enclosure?: ElementCompact
  guid?: ElementCompact
  'content:encoded'?: ElementCompact
}
