import type { XHRRequestOptions } from "../types"
import { getURIBody } from "./functions"
import { isFormData } from "./selectors"

export const fetchXHR = (url: string, options: XHRRequestOptions = {
  method: 'GET',
}) => new Promise<XMLHttpRequest>((resolve, reject) => {
  const xhr = new XMLHttpRequest()

  xhr.open(options.method, url)

  xhr.onload = () => xhr.status >= 200 && xhr.status <= 299
    ? resolve(xhr)
    : reject(xhr)

  xhr.onerror = () => reject(xhr)

  if (options?.onUploadProgress) {
    xhr.onprogress = options.onUploadProgress
  }

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
  }

  let payload: undefined | string
  if (isFormData(options?.body)) {
    xhr.send(options.body)
  } else if (typeof options?.body === 'object') {
    payload = getURIBody(options.body as Record<string, unknown>)

    xhr.send(payload)
  } else {
    xhr.send()
  }
})
