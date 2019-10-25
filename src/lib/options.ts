import { Image, Person, FeedLinks } from './types'

export interface Options {
  id?: string
  /**
   * The name of the channel. It's how people refer to your service. If you
   * have an HTML website that contains the same information as your RSS file,
   * the title of your channel should be the same as the title of your website.
   */
  title?: string
  /** Phrase or sentence describing the channel. */
  description?: string
  /** The last time the content of the channel changed. */
  updated?: Date
  /** The URL to the HTML website corresponding to the channel. */
  link?: string
  /**
   * The publication date for the content in the channel. For example, the New
   * York Times publishes on a daily basis, the publication date flips once
   * every 24 hours. That's when the pubDate of the channel changes
   */
  published?: Date
  /** A string indicating the program used to generate the channel. */
  generator?: string
  /**
   * The language the channel is written in. This allows aggregators to group
   * all Italian language sites, for example, on a single page. A list of
   * allowable values for this element, as provided by Netscape, is
   * [here](http://backend.userland.com/stories/storyReader$16).
   * You may also use
   * [values defined](https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes)
   * by the W3C.
   */
  language?: string

  image?: Image

  docs?: string

  /** Copyright notice for content in the channel. */
  copyright?: string
  /** Email address for person responsible for editorial content. */
  managingEditor?: Person
  /**
   * Email address for person responsible for technical issues relating
   * to channel.
   */
  webMaster?: Person

  ttl?: string | number

  feedLinks?: FeedLinks

  // feed2 config
  indentation?: number
  loose?: boolean
}
