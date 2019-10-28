import { js2xml, ElementCompact } from 'xml-js'
import { BaseRenderer } from '../lib/renderer'
import { Feed } from '../lib/feed'
import { Options } from './options'
import { generator } from '../lib/generator'
import {
  addSimple,
  extensionToElementCompact,
  filterExtensions,
  addCDATA,
} from '../lib/helpers'
import {
  Category,
  Person,
  Source,
  Extension,
  Image,
  GUID,
  Media,
} from '../lib/types'
import { Rss, RssItem, RssImage, Channel } from './types'

export class Renderer extends BaseRenderer<Options> {
  protected isContent = false
  protected isAtom = false

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

    if (this.isContent) {
      feed.addNamespace({
        ns: 'xmlns',
        name: 'content',
        uri: 'http://purl.org/rss/1.0/modules/content/',
      })
    }

    if (this.isAtom) {
      feed.addNamespace({
        ns: 'xmlns',
        name: 'atom',
        uri: 'http://www.w3.org/2005/Atom2',
      })
    }

    this.appendNamespaces(feed, root)

    return js2xml(root, {
      compact: true,
      ignoreComment: true,
      spaces: options.indentation || 2,
    })
  }

  protected buildImage(img: Image, feed: Feed): RssImage {
    const i: Partial<RssImage> = {}

    addSimple(i, 'url', img.url)
    addSimple(i, 'title', img.title || feed.options.title)
    addSimple(i, 'link', img.link || feed.options.link)
    addSimple(i, 'width', img.width)
    addSimple(i, 'height', img.height)
    addSimple(i, 'description', img.description)

    return i as RssImage
  }

  protected buildItems(feed: Feed): RssItem[] {
    const items: RssItem[] = feed.items.map((item) => {
      const i: RssItem = {}

      addSimple(i, 'title', item.title)
      addSimple(i, 'description', item.description)
      addSimple(i, 'link', item.link)
      addSimple(i, 'comments', item.comments)

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

      if (item.id) {
        i.guid = this.buildGUID(item.id)
      } else {
        addSimple(i, 'guid', item.link)
      }

      if (item.date) {
        addSimple(i, 'pubDate', item.date.toUTCString())
      }

      if (item.content) {
        this.isContent = true
        addCDATA(i, 'content:encoded', item.content)
      }

      if (item.media) {
        i.enclosure = this.buildEnclosure(item.media)
      }

      if (item.extension) {
        this.buildExtensions(i, item.extension)
      }

      return i
    })

    return items
  }

  protected buildEnclosure(media: Media | Media[]): ElementCompact {
    const makeEnc = (md: Media): ElementCompact => {
      const attr: ElementCompact = { url: md.url }
      const m: ElementCompact = { _attributes: attr }

      if (md.contentType) {
        attr.type = md.contentType
      }

      if (md.size) {
        attr.length = md.size
      }

      return m
    }

    if (Array.isArray(media)) {
      return media.map(makeEnc)
    }

    return makeEnc(media)
  }

  protected buildGUID(id: GUID | string): ElementCompact {
    const guid: ElementCompact = { _attributes: { isPermaLink: 'false' } }

    if (typeof id === 'string') {
      guid._text = id
    } else {
      guid._text = id.id

      if (typeof id.isPermaLink !== 'undefined') {
        // Doh!
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        guid._attributes!.isPermaLink = id.isPermaLink.toString()
      }
    }

    return guid
  }

  protected buildChannel(feed: Feed): Rss {
    const options = feed.options as Options

    const channel: Partial<Channel> = {}

    addSimple(channel, 'title', options.title)
    addSimple(channel, 'link', options.link)
    addSimple(channel, 'description', options.description)
    addSimple(channel, 'generator', options.generator || generator)
    addSimple(channel, 'language', options.language)
    addSimple(channel, 'copyright', options.copyright)
    addSimple(channel, 'ttl', options.ttl)
    addSimple(
      channel,
      'docs',
      options.docs || 'https://validator.w3.org/feed/docs/rss2.html'
    )
    addSimple(
      channel,
      'lastBuildDate',
      (options.updated || new Date()).toUTCString()
    )
    addSimple(
      channel,
      'pubDate',
      options.published && options.published.toUTCString()
    )

    if (options.feedLinks && options.feedLinks.atom) {
      this.isAtom = true
      addSimple(channel, 'atom:link', options.feedLinks.atom, { rel: 'self' })
    }

    if (options.feedLinks && options.feedLinks.hub) {
      this.isAtom = true

      let atoms: ElementCompact[] = channel['atom:link'] || []

      if (!Array.isArray(atoms)) {
        atoms = [atoms]
      }

      atoms.push({
        _attributes: { rel: 'self', href: options.feedLinks.hub },
      })

      channel['atom:link'] = atoms
    }

    if (options.image) {
      channel.image = this.buildImage(options.image, feed)
    }

    if (feed.categories) {
      channel.category = []

      for (const c of feed.categories) {
        channel.category.push(this.buildCategory(c))
      }
    }

    this.buildExtensions(channel, feed.extensions)

    const root: Rss = {
      _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
      rss: {
        _attributes: { version: '2.0' },
        channel: channel as Channel,
      },
    }

    return root
  }

  protected buildExtensions(
    node: ElementCompact,
    extensions: Extension | Extension[]
  ): void {
    if (!Array.isArray(extensions)) {
      extensions = [extensions]
    }

    filterExtensions(extensions, 'rss2').forEach((ext) => {
      node[ext.name] = extensionToElementCompact(ext.value)
    })
  }

  protected buildCategory(cat: Category): ElementCompact {
    if (typeof cat === 'string') {
      cat = { name: cat }
    }

    const c: ElementCompact = { _text: cat.name }

    if (cat.domain) {
      c._attributes = { domain: cat.domain }
    }

    return c
  }

  protected buildPerson(p: Person): ElementCompact {
    const c: ElementCompact = {}

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
    const s: ElementCompact = {
      _text: source.name,
      _attributes: { url: source.url },
    }

    return s
  }
}
