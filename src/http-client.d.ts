import type { Noop } from "./utils/function"

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type HttpOptions = Exclude<RequestInit, 'body' | 'method'>
export type Body = RequestInit['body']

export type GetHeaders = Noop | (() => RequestInit['headers'])

export type NewHttpParams = {
  baseURL: string
  getHeaders?: GetHeaders
}
