
export const getURL = (url: string, apiURL: string) => /^http/i.test(url)
  ? url
  : `${apiURL}${url}`
