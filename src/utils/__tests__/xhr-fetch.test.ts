import '../../server/xmlhttprequest'
import { fetchXHR } from '../xhrFetch'

const getURL = (path: string) => `${global.address}${path}`

describe('utils/xhr-fetch', () => {
  test('Should return XMLHttpRequest instance', async () => {
    const xhr = await fetchXHR(getURL('todos/1'))

    expect(xhr instanceof XMLHttpRequest).toBeTruthy()
  })

  test('Should make GET request', async () => {
    const xhr = await fetchXHR(getURL('todos/1'))

    expect(JSON.parse(xhr.response)).toMatchObject({
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false
    })
  })

  // test('Should call XHR upload progress', async () => {
  //   const xhr = await fetchXHR('https://jsonplaceholder.typicode.com/todos/1', {
  //     method: 'POST',
  //     onUploadProgress: event => {
  //       if (event.lengthComputable) {
  //         console.log(`Получено ${event.loaded} из ${event.total} байт`)
  //       } else {
  //         console.log(`Получено ${event.loaded} байт`)
  //       }
  //     }
  //   })

  //   expect(JSON.parse(xhr.response)).toMatchObject({
  //     userId: 1,
  //     id: 1,
  //     title: 'delectus aut autem',
  //     completed: false
  //   })
  // })
})
