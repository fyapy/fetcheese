import '../server'
import mock from '../__mocks__/index.mock'
import { createClient } from '../index'
import type { NewHttpClient } from '../types'

const createNew = (options: Omit<NewHttpClient, 'baseURL'>) => createClient({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  ...options,
})

describe('createClient fetch based', () => {
  test('Should be called global getHeaders', async () => {
    const getHeaders = jest.fn(() => mock.headerAuthorized)

    await createNew({ getHeaders }).post('posts', mock.postPayload)

    expect(getHeaders).toBeCalledTimes(1)
  })

  test('Should be called global lifecycle hook before', async () => {
    const before = jest.fn(() => {})

    await createNew({ before }).post('posts', mock.postPayload)

    expect(before).toBeCalledTimes(1)
  })

  test('Should be called global lifecycle hook after', async () => {
    let afterResponse: Response | undefined
    const after = jest.fn(async (response: Response) => afterResponse = response.clone())

    await createNew({ after }).post('posts', mock.postPayload)

    expect(after).toBeCalledTimes(1)
    expect(afterResponse instanceof Response).toBeTruthy()
  })

  test('Should be called global transform', async () => {
    const transform = jest.fn(data => ({ data }))

    const res = await createNew({ transform }).get('todos/1')

    expect(transform).toBeCalledTimes(1)
    expect(res).toMatchObject({
      data: mock.todoOne,
    })
  })

  test('Should be called global handleError', async () => {
    let errorResponse: Response | undefined
    const handleError = jest.fn(async (response: Response) => errorResponse = response.clone())

    try {
      await createNew({ handleError }).get('poasdsts/1')
    } catch (e) {}

    expect(handleError).toBeCalledTimes(1)
    expect(errorResponse instanceof Response).toBeTruthy()
  })
})

