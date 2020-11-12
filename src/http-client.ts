import type {
  GetHeaders,
  HttpOptions,
  HttpMethod,
  Body,
  NewHttpParams,
} from './http-client.d'
import { noop } from './utils/function'
import { httpMask } from './utils/mask'

export class HttpFetch {
  public baseURL: string
  public getHeaders: GetHeaders

  private readonly defaultHeaders: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  constructor({
    baseURL,
    getHeaders = noop,
  }: NewHttpParams) {
    this.baseURL = baseURL
    this.getHeaders = getHeaders
  }

  public get = <R = any>(url: string, options?: HttpOptions) => this.request<R>('GET', url, options)

  public post = async <R = any>(url: string, body?: Body, options?: HttpOptions) => {
    const fullOptions = this.formatBody(body, options)

    return await this.request<R>('POST', url, fullOptions)
  }

  public put = async <R = any>(url: string, body?: Body, options?: HttpOptions) => {
    const fullOptions = this.formatBody(body, options)

    return await this.request<R>('PUT', url, fullOptions)
  }

  public delete = async <R = any>(url: string, body?: Body, options?: HttpOptions) => {
    const fullOptions = this.formatBody(body, options)

    return await this.request<R>('DELETE', url, fullOptions)
  }

  private request = <R>(
    method: HttpMethod,
    url: string,
    options: HttpOptions,
  ) => this.makeRequest<R>(url, {
    ...options,
    method,
  })

  private readonly makeRequest = async <R>(url: string, options: RequestInit) => {
    const response = await fetch(httpMask.test(url)
      ? url
      : `${this.baseURL}${url}`,
      options,
    )

    if (response.ok) {
      return await response.json() as R
    }

    throw response
  }

  private formatBody = (body: Body, options: HttpOptions) => {
    const isFormData = body instanceof FormData

    return {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getHeaders(),
        ...(isFormData
          ? { Accept: 'multipart/form-data' }
          : {}),
        ...options.headers,
      },
      body: isFormData
        ? body
        : JSON.stringify(body),
    }
  }

  private axiosGet = <R = any>(url: string, options?: HttpOptions) => this.get<R>(url, options)
    .then(data => ({ data }))
  private axiosPost = <R = any>(url: string, body?: Body, options?: HttpOptions) => this
    .post<R>(url, body, options)
    .then(data => ({ data }))
  private axiosPut = <R = any>(url: string, body?: Body, options?: HttpOptions) => this
    .put<R>(url, body, options)
    .then(data => ({ data }))
  private axiosDelete = <R = any>(url: string, body?: Body, options?: HttpOptions) => this
    .post<R>(url, body, options)
    .then(data => ({ data }))

  public axios = ({
    get: this.axiosGet,
    post: this.axiosPost,
    put: this.axiosPut,
    delete: this.axiosDelete,
  })
}
