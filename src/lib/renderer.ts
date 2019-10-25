/* eslint-disable @typescript-eslint/no-explicit-any */

import { ElementCompact } from 'xml-js'
import { Feed } from './feed'
import { Options } from './options'
import { MissingRequiredOptionError, fqn } from './helpers'

export abstract class BaseRenderer<T extends Options> {
  protected requiredOptions: Array<keyof T> = []
  public abstract render(feed: Feed): string
  protected abstract buildChannel(feed: Feed): any
  protected abstract buildItems(feed: Feed): any[]
  protected checkRequiredOptions(options: T): void {
    if (options.loose) {
      return
    }

    for (const req of this.requiredOptions) {
      if (!options[req]) {
        throw new MissingRequiredOptionError(req as string)
      }
    }
  }

  protected appendNamespaces(feed: Feed, root: ElementCompact): void {
    if (feed.namespaces.length) {
      for (const ns of feed.namespaces) {
        root.rss._attributes[fqn(ns)] = ns.uri
      }
    }
  }
}
