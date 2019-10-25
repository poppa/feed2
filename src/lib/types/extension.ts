export interface ExtensionValueObject {
  text?: string | number
  attributes?: { [key: string]: string | number }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtensionValueJson = { [key: string]: any }
export type ExtensionValueArray = Array<ExtensionValueSimple>
export type ExtensionValueSimple = ExtensionValueObject | string | number
export type ExtensionValue = ExtensionValueArray | ExtensionValueSimple

export type ExtensionFeedTypes = 'rss2' | 'atom1' | 'json1'
export type ExtensionType = ExtensionFeedTypes | ExtensionFeedTypes[]

export interface Extension<T = ExtensionValue> {
  name: string
  value: T
  type: ExtensionType
}
