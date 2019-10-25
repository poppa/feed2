import { Options } from './options'
import { Renderer as Rss2Renderer } from '../rss2/renderer'
import { Renderer as Atom1Renderer } from '../atom1/renderer'
import { Renderer as Json1Renderer } from '../json1/renderer'
import { Item, Namespace, Category, Extension } from './types'

export class Feed {
  public readonly items: Item[] = []
  protected _options: Options
  protected _namespaces: Namespace[] = []
  protected _categories: Category[] = []
  protected _extensions: Extension[] = []
  protected _rss2Renderer: typeof Rss2Renderer = Rss2Renderer
  protected _atom1Renderer: typeof Atom1Renderer = Atom1Renderer
  protected _json1Renderer: typeof Json1Renderer = Json1Renderer

  constructor(options: Options) {
    this._options = options
  }

  public get rss2Renderer(): typeof Rss2Renderer {
    return this._rss2Renderer
  }

  public set rss2Renderer(renderer: typeof Rss2Renderer) {
    this._rss2Renderer = renderer
  }

  public get atom1Renderer(): typeof Atom1Renderer {
    return this._atom1Renderer
  }

  public set atom1Renderer(renderer: typeof Atom1Renderer) {
    this._atom1Renderer = renderer
  }

  public get json1Renderer(): typeof Json1Renderer {
    return this._json1Renderer
  }

  public set json1Renderer(renderer: typeof Json1Renderer) {
    this._json1Renderer = renderer
  }

  public get namespaces(): Namespace[] {
    return this._namespaces
  }

  public get categories(): Category[] {
    return this._categories
  }

  public get options(): Options {
    return this._options
  }

  public get extensions(): Extension[] {
    return this._extensions
  }

  public addItem(item: Item): this {
    this.items.push(item)
    return this
  }

  public addNamespace(namespace: Namespace | Namespace[]): this {
    if (!Array.isArray(namespace)) {
      namespace = [namespace]
    }

    this._namespaces = [...this._namespaces, ...namespace]

    return this
  }

  public addCategory(category: Category | Category[]): this {
    if (!Array.isArray(category)) {
      category = [category]
    }

    this._categories = [...this._categories, ...category]

    return this
  }

  public addExtension(extension: Extension | Extension[]): this {
    if (!Array.isArray(extension)) {
      extension = [extension]
    }

    this._extensions = [...this._extensions, ...extension]

    return this
  }

  public rss2<T extends Rss2Renderer>(renderer?: T): string {
    return (renderer || new this._rss2Renderer()).render(this)
  }

  public atom1<T extends Atom1Renderer>(render?: T): string {
    return (render || new this._atom1Renderer()).render(this)
  }

  public json1<T extends Json1Renderer>(render?: T): string {
    return (render || new this._json1Renderer()).render(this)
  }
}
