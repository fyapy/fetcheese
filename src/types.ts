export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type HttpOptions = Exclude<RequestInit, 'body' | 'method'>
export type HttpBody = RequestInit['body']

export interface GetHeaders {
  (): {}
  (): RequestInit['headers']
}

export type NewHttpClient = {
  baseURL: string
  getHeaders?: GetHeaders
}
