export const noop = () => ({})
export type Noop = typeof noop

const converURIBody = (text: string, data: Record<string, unknown>, parentKey?: string) => {
  if (
    data
    && typeof data === 'object'
    && !(data instanceof Date)
    && !(data instanceof File)
  ) {
    Object.keys(data).forEach(key => converURIBody(
      text,
      data[key] as any,
      parentKey
        ? `${parentKey}[${key}]`
        : key,
    ))
  } else if (parentKey) {
    const value = data === null ? '' : data

    text += encodeURIComponent(parentKey) + '=' + encodeURIComponent(value as any)
  }
}

export const getURIBody = (data: Record<string, unknown>): string => {
  const text = ''
  converURIBody(text, data)
  return text
}
