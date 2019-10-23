import { Options as BaseOptions } from '../lib/options'

export interface Options extends BaseOptions {
  title: string
  /** The URL to the HTML website corresponding to the channel. */
  link: string
  description: string
  /** Copyright notice for content in the channel. */
  copyright?: string
  /** Email address for person responsible for editorial content. */
  managingEditor?: string
  /**
   * Email address for person responsible for technical issues relating
   * to channel.
   */
  webMaster?: string
}
