import {
  HttpBody,
  HttpMethod,
  HttpOptions,
  NewHttpClient,
} from "./types"
import { noop } from "./utils/functions"
import { getURL, isFormData } from "./utils/selectors"
import { defaultHeaders } from "./utils/constants"

export const createClient = ({
  baseURL,
  getHeaders = noop,
  before,
  handleError,
  transform,
  after,
}: NewHttpClient) => {
  const formatBody = (body: HttpBody, options: HttpOptions = {}) => {
    const isForm = isFormData(body)

    return {
      ...options,
      headers: Object.assign(
        {},
        defaultHeaders,
        getHeaders(),
        isForm
          ? { Accept: 'multipart/form-data' }
          : {},
        options?.headers,
      ),
      body: isForm
        ? body as FormData
        : JSON.stringify(body),
    }
  }

  const request = async <R>(
    method: HttpMethod,
    url: string,
    {
      responseType = 'json',
      ...options
    }: HttpOptions = {},
  ) => {
    await (options?.before || before)?.()

    const response = await fetch(getURL(url, baseURL), {
      ...options,
      method,
    })

    if (response.ok) {
      await (options?.after || after)?.(response)

      let res: R | string | Blob | FormData | ArrayBuffer | Response
      try {
        switch (responseType) {
          case 'json':
            res = await response.json() as R
            break
          case 'text':
            res = await response.text()
            break
          case 'blob':
            res = await response.blob()
            break
          case 'formData':
            res = await response.formData()
            break
          case 'arrayBuffer':
            res = await response.arrayBuffer()
            break
          default:
            res = response
        }
      } catch (error) {
        res = response
        console.error(`Incorrect option 'responseType' is ${responseType}`)
      }

      const transformFn = options?.transform || transform
      if (transformFn) {
        res = await transformFn(res) as R
      }

      return res
    }

    await (options?.handleError || handleError)?.(response)

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
