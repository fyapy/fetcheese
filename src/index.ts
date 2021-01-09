import {
  GetHeaders,
  HttpBody,
  HttpMethod,
  HttpOptions,
  NewHttpClient,
} from "./types"
import { noop } from "utils/functions"
import { getURL } from "utils/selectors"

export const createClient = ({
  baseURL,
  getHeaders = noop,
  before = noop,
}: NewHttpClient) => {
  const apiURL: string = baseURL
  const headersMixin: GetHeaders = getHeaders

  const defaultHeaders: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const formatBody = (body: HttpBody, options?: HttpOptions) => {
    const isFormData = body instanceof FormData

    return {
      ...options,
      headers: {
        ...defaultHeaders,
        ...headersMixin(),
        ...(isFormData
          ? { Accept: 'multipart/form-data' }
          : {}),
        ...options?.headers,
      },
      body: isFormData
        ? body
        : JSON.stringify(body),
    }
  }

  const request = async <R>(
    method: HttpMethod,
    url: string,
    options?: HttpOptions,
  ) => {
    const beforeFn = before()
    if (beforeFn instanceof Promise) {
      await beforeFn
    }

    const response = await fetch(getURL(url, apiURL), {
      ...options,
      method,
    })

    if (response.ok) {
      return await response.json() as R
    }

    throw response
  }

  

  const get = <R = any>(url: string, options?: HttpOptions) => request<R>('GET', url, options)

  const post = async <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => {
    const fullOptions = formatBody(body, options)

    return await request<R>('POST', url, fullOptions)
  }

  const put = async <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => {
    const fullOptions = formatBody(body, options)

    return await request<R>('PUT', url, fullOptions)
  }

  const del = async <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => {
    const fullOptions = formatBody(body, options)

    return await request<R>('DELETE', url, fullOptions)
  }


  const axiosGet = <R = any>(url: string, options?: HttpOptions) => get<R>(url, options)
    .then(data => ({ data }))
  const axiosPost = <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => post<R>(url, body, options)
    .then(data => ({ data }))
  const axiosPut = <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => put<R>(url, body, options)
    .then(data => ({ data }))
  const axiosDelete = <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => post<R>(url, body, options)
    .then(data => ({ data }))

  return {
    get,
    post,
    put,
    delete: del,
    axios: ({
      get: axiosGet,
      post: axiosPost,
      put: axiosPut,
      delete: axiosDelete,
    }),
  }
}
