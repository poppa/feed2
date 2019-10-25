import { ElementCompact } from 'xml-js'
import { Namespace, ExtensionValue, Extension, ExtensionType } from './types'

export class MissingRequiredOptionError extends Error {
  constructor(option: string) {
    super()
    this.name = this.constructor.name
    this.message = `Missing required option "${option}"`
  }
}

function addNode<O extends ElementCompact, K extends keyof O>(
  obj: O,
  key: K,
  value: string | number | undefined,
  prop: keyof ElementCompact
): void {
  if (typeof value !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj[key] = { [prop]: `${value}` } as any
  }
}

/**
 * Add the property `key` to `obj` as `{ _text: value }` if `value` is defined.
 * So this adds an {@link xml-js#ElementCompact | ElementCompact} object to
 * the property.
 *
 * @internal
 *
 * @param obj - The object to add the property to
 * @param key - The property name to set
 * @param value - The value to set
 */
export function addSimple<O extends ElementCompact, K extends keyof O>(
  obj: O,
  key: K,
  value: string | number | undefined
): void {
  addNode(obj, key, value, '_text')
}

/**
 * Add the property `key` to `obj` as `{ _cdata: value }` if `value` is defined.
 * So this adds an {@link xml-js#ElementCompact | ElementCompact} object to
 * the property.
 *
 * @internal
 *
 * @param obj - The object to add the property to
 * @param key - The property name to set
 * @param value - The value to set
 */
export function addCDATA<O extends ElementCompact, K extends keyof O>(
  obj: O,
  key: K,
  value: string | number | undefined
): void {
  addNode(obj, key, value, '_cdata')
}

/**
 * @internal
 * @param ns
 */
export function fqn(ns: Namespace): string {
  if (ns.ns) {
    return `${ns.ns}:${ns.name}`
  }

  return ns.name
}

export function extensionToElementCompact(
  ext: ExtensionValue
): ElementCompact | Array<ElementCompact> {
  const ret: ElementCompact = {}

  if (typeof ext === 'string' || typeof ext === 'number') {
    ret._text = ext
  } else if (Array.isArray(ext)) {
    return ext.map((e) => extensionToElementCompact(e))
  } else {
    if (ext.text) {
      ret._text = ext.text
    }

    if (ext.attributes) {
      ret._attributes = ext.attributes
    }
  }

  return ret
}

export function filterExtensions(
  ext: Extension[],
  type: ExtensionType
): Extension[] {
  if (!Array.isArray(type)) {
    type = [type]
  }

  return ext.filter((e) => {
    if (Array.isArray(e.type)) {
      return e.type.some((ee) => type.includes(ee))
    } else {
      return type.includes(e.type)
    }
  })
}
