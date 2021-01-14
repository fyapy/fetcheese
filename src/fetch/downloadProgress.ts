
type CallbackParams = {
  loaded: number
  total: number
  done: boolean
}
type DownloadProgressCallback = (progress: CallbackParams) => void

export const downloadProgress = (
  response: Response,
  cb: DownloadProgressCallback,
) => (async () => {
  let loaded = 0
  const reader = response.clone().body?.getReader()

  const total = Number(response.headers.get('Content-Length'))

  if (!reader || Number.isNaN(total)) return

  while (true) {
    const { done, value } = await reader.read();

    if (value) loaded += value.length

    cb({ loaded, total, done })

    if (done) break
  }
})()
