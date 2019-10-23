export type RequiredProps<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type SetType<I, T> = { [P in keyof I]: I[P] extends [] ? T[] : T }
