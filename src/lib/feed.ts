import { Options } from './options'
import { Renderer as Rss2Renderer } from '../rss2/renderer'
import { Item, Namespace, Category, Extension } from './types'

export class Feed {
  public readonly items: Item[] = []
  protected _options: Options
  protected _namespaces: Namespace[] = []
  protected _categories: Category[] = []
  protected _extensions: Extension[] = []
  protected _rss2Renderer: typeof Rss2Renderer = Rss2Renderer

  constructor(options: Options) {
    this._options = options
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
}
