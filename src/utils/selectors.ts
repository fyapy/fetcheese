
export const getURL = (url: string, apiURL: string) => /^http/i.test(url)
  ? url
  : `${apiURL}${url}`

export const isFormData = (body: any): body is FormData => body instanceof FormData
