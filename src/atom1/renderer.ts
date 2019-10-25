import { ElementCompact } from 'xml-js'
import { BaseRenderer } from '../lib/renderer'
import { Options } from './options'
import { Feed } from '../lib/feed'

export class Renderer extends BaseRenderer<Options> {
  render(_feed: Feed): never {
    throw new Error('Atom 1 not implemented yet')
  }

  buildChannel(): ElementCompact {
    return {}
  }

  buildItems(): ElementCompact[] {
    return []
  }
}
