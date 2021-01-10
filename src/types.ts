export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export interface HttpInit extends RequestInit {
  before?: BeforeRequest
  after?: HandleReponse
  transform?: Transform
  handleError?: HandleReponse
}
export type HttpOptions = Exclude<HttpInit, 'body' | 'method'>
export type HttpBody = RequestInit['body'] | Record<string, unknown>

export interface GetHeaders {
  (): RequestInit['headers']
  (): {}
}
export type BeforeRequest = (() => Promise<void>) | (() => void)
export type HandleReponse = ((response: Response) => void) | ((response: Response) => Promise<void>)
export type Transform = ((data: any) => any) | ((data: any) => Promise<any>)

export type NewHttpClient = {
  baseURL: string
  getHeaders?: GetHeaders
  before?: BeforeRequest
  after?: HandleReponse
  handleError?: HandleReponse
  transform?: Transform
}
