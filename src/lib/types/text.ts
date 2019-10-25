export interface TextObject {
  text: string
  cdata?: boolean
}

export type Text = TextObject | string

export type TextComplete = TextObject & { cdata: boolean }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTextObject(obj: any): obj is TextObject {
  return typeof obj === 'object' && 'text' in obj
}
