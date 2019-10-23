import { js2xml, ElementCompact } from 'xml-js'
import { BaseRenderer } from '../lib/renderer'
import { Feed } from '../lib/feed'
import { Options } from './options'
import { generator } from '../lib/generator'
import { addSimple, fqn } from '../lib/helpers'
import { Category, Person, Source } from '../lib/types'
import { Rss, EC, RssItem } from './types'

export class Renderer extends BaseRenderer<Options> {
  protected requiredOptions: Array<keyof Options> = [
    'link',
    'description',
    'title',
  ]

  public render(feed: Feed): string {
    const options = feed.options as Options
    this.checkRequiredOptions(options)

    const root = this.buildChannel(feed)
    root.rss.channel.item = this.buildItems(feed)

    return js2xml(root, {
      compact: true,
      ignoreComment: true,
      spaces: options.indentation || 2,
    })
  }

  protected buildItems(feed: Feed): RssItem[] {
    const items: RssItem[] = feed.items.map((item) => {
      const i: RssItem = {}
      addSimple(i, 'title', item.title)
      addSimple(i, 'link', item.link)
      addSimple(i, 'description', item.description)

      if (item.author) {
        i.author = this.buildPerson(item.author)
      }

      if (item.source) {
        i.source = this.buildSource(item.source)
      }

      if (item.category) {
        if (!Array.isArray(item.category)) {
          item.category = [item.category]
        }

        i.category = item.category.map((c) => this.buildCategory(c))
      }

      return i
    })

    return items
  }

  protected buildChannel(feed: Feed): Rss {
    const options = feed.options as Options

    const root: Rss = {
      _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
      rss: {
        _attributes: { version: '2.0' },
        channel: {
          title: { _text: options.title },
          link: { _text: options.link },
          description: { _text: options.description },
          generator: { _text: options.generator || generator },
          lastBuildDate: {
            _text: (options.updated || new Date()).toUTCString(),
          },
          docs: {
            _text:
              options.docs || 'https://validator.w3.org/feed/docs/rss2.html',
          },
        },
      },
    }

    if (options.published) {
      root.rss.channel.pubDate = { _text: options.published.toUTCString() }
    }

    if (feed.namespaces.length) {
      for (const ns of feed.namespaces) {
        root.rss._attributes[fqn(ns)] = ns.uri
      }
    }

    if (options.language) {
      root.rss.channel.language = { _text: options.language }
    }

    if (options.image) {
      root.rss.channel.image = {
        url: { _text: options.image.url },
        title: { _text: options.image.title || options.title },
        link: { _text: options.image.link || options.link },
      }
    }

    if (options.copyright) {
      root.rss.channel.copyright = { _text: options.copyright }
    }

    if (feed.categories) {
      root.rss.channel.category = []

      for (const c of feed.categories) {
        root.rss.channel.category.push(this.buildCategory(c))
      }
    }

    if (options.ttl) {
      root.rss.channel.ttl = { _text: `${options.ttl}` }
    }

    return root
  }

  protected buildCategory(cat: Category): ElementCompact {
    const c: EC = { _text: cat.name }

    if (cat.domain) {
      c._attributes = { domain: cat.domain }
    }

    return c
  }

  protected buildPerson(p: Person): ElementCompact {
    const c: EC = {}

    if (p.email) {
      let n = `${p.email}`

      if (p.name) {
        n = `${n} (${p.name})`
      }

      c._text = n
    }

    return c
  }

  protected buildSource(source: Source): ElementCompact {
    const s: EC = {
      _text: source.name,
      _attributes: { url: source.url },
    }

    return s
  }
}
