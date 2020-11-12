import { HttpFetch } from "./http-client"

type ListResponse = { list: string[] }

;(async () => {
  const client = new HttpFetch({
    baseURL: 'https://google.com',
  })

  const res = client.get<ListResponse>('/list')
  console.log(res)


  const axiosRes = client.axios.get<ListResponse>('/list')
  console.log(axiosRes)
})()
