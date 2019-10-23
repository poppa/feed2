/* eslint-disable @typescript-eslint/no-explicit-any */
import { Feed } from './feed'
import { Options } from './options'
import { MissingRequiredOptionError } from './helpers'

export abstract class BaseRenderer<T extends Options> {
  protected requiredOptions: Array<keyof T> = []
  public abstract render(feed: Feed): string
  protected abstract buildChannel(feed: Feed): any
  protected abstract buildItems(feed: Feed): any[]
  protected checkRequiredOptions(options: T): void {
    for (const req of this.requiredOptions) {
      if (!options[req]) {
        throw new MissingRequiredOptionError(req as string)
      }
    }
  }
}
