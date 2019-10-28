export interface TextObject {
  text: string
  cdata?: boolean
}

export type Text = TextObject | string

export type TextComplete = TextObject & { cdata: boolean }
