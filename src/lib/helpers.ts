import { ElementCompact } from 'xml-js'
import { Namespace } from './types'

export class MissingRequiredOptionError extends Error {
  constructor(option: string) {
    super()
    this.name = this.constructor.name
    this.message = `Missing required option "${option}"`
  }
}

export function addSimple<O extends ElementCompact, K extends keyof O>(
  obj: O,
  key: K,
  value: string | number | undefined
): void {
  if (typeof value !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj[key] = { _text: `${value}` } as any
  }
}

export function fqn(ns: Namespace): string {
  if (ns.ns) {
    return `${ns.ns}:${ns.name}`
  }

  return ns.name
}
