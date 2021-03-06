import { ElementCompact } from 'xml-js'
import {
  Namespace,
  ExtensionValue,
  Extension,
  ExtensionType,
  Text,
  TextComplete,
  TextObject,
} from './types'

export class MissingRequiredOptionError extends Error {
  constructor(option: string) {
    super()
    this.name = this.constructor.name
    this.message = `Missing required option "${option}"`
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTextObject(obj: any): obj is TextObject {
  return typeof obj === 'object' && 'text' in obj
}

export function toTextComplete(text: Text): TextComplete {
  if (typeof text === 'string') {
    return { text, cdata: false }
  }

  if (typeof text.cdata === 'undefined') {
    text.cdata = true
  }

  return text as TextComplete
}

function addNode<O extends ElementCompact, K extends keyof O>(
  obj: O,
  key: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  prop: keyof ElementCompact,
  attributes?: ElementCompact
): void {
  if (typeof value !== 'undefined') {
    if (isTextObject(value)) {
      value = value.text
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj[key] = { [prop]: `${value}` } as any
  }

  if (attributes) {
    if (!obj[key]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj[key] = {} as any
    }

    obj[key]._attributes = attributes
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  attributes?: ElementCompact
): void {
  if (isTextObject(value)) {
    const t = toTextComplete(value)

    if (t.cdata) {
      return addNode(obj, key, t.text, '_cdata', attributes)
    }
  }

  addNode(obj, key, value, '_text', attributes)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
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

export function xmlEscape(input: string): string {
  if (input.trim() !== '') {
    input = input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/&(?!(amp;)|(lt;)|(gt;)|(quot;)|(#39;)|(apos;))/g, '&amp;')
      // replaces odd backslash(\\) with even.
      .replace(/([^\\])((\\\\)*)\\(?![\\/{])/g, '$1\\\\$2')
  }

  return input
}

export function escapeAttributeCallback(
  attributeValue: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): string {
  if (typeof attributeValue === 'string') {
    return xmlEscape(attributeValue)
  }

  return attributeValue
}
