import '../server'
import mock from '../__mocks__/index.mock'
import { createClient } from '../index'
import type { NewHttpClient } from '../types'

const createNew = (options?: Omit<NewHttpClient, 'baseURL'>) => createClient({
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

  test('Should be called local lifecycle hook before and not called global before', async () => {
    const before = jest.fn(() => {})
    const localBefore = jest.fn(() => {})

    await createNew({ before }).post('posts', mock.postPayload, {
      before: localBefore,
    })

    expect(localBefore).toBeCalledTimes(1)
    expect(before).toBeCalledTimes(0)
  })

  test('Should be called global lifecycle hook after', async () => {
    let afterResponse: Response | undefined
    const after = jest.fn(async (response: Response) => afterResponse = response.clone())

    await createNew({ after }).post('posts', mock.postPayload)

    expect(after).toBeCalledTimes(1)
    expect(afterResponse instanceof Response).toBeTruthy()
  })

  test('Should be called local lifecycle hook after and not called global after', async () => {
    let afterResponse: Response | undefined
    const after = jest.fn(async (response: Response) => afterResponse = response.clone())

    let localAfterResponse: Response | undefined
    const localAfter = jest.fn(async (response: Response) => localAfterResponse = response.clone())
    
    await createNew({ after }).post('posts', mock.postPayload, {
      after: localAfter,
    })

    expect(localAfter).toBeCalledTimes(1)
    expect(localAfterResponse instanceof Response).toBeTruthy()
    expect(after).toBeCalledTimes(0)
    expect(afterResponse instanceof Response).toBeFalsy()
  })

  test('Should be called global transform', async () => {
    const transform = jest.fn(data => ({ data }))

    const res = await createNew({ transform }).get<typeof mock.todoOne>('todos/1')

    expect(transform).toBeCalledTimes(1)
    expect(res).toMatchObject({
      data: mock.todoOne,
    })
  })

  test('Should be called local transform and not called global transform', async () => {
    const transform = jest.fn(data => ({ data }))
    const localTransform = jest.fn(data => ({ local: data }))

    const res = await createNew({ transform }).get<typeof mock.todoOne>('todos/1', {
      transform: localTransform,
    })

    expect(transform).toBeCalledTimes(0)
    expect(localTransform).toBeCalledTimes(1)
    expect(res).toMatchObject({
      local: mock.todoOne,
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

  test('Should be called local handleError and not called global handleError', async () => {
    let errorResponse: Response | undefined
    const handleError = jest.fn(async (response: Response) => errorResponse = response.clone())


    let localErrorResponse: Response | undefined
    const localHandleError = jest.fn(async (response: Response) => localErrorResponse = response.clone())

    try {
      await createNew({ handleError }).get('poasdsts/1', {
        handleError: localHandleError,
      })
    } catch (e) {}

    expect(localHandleError).toBeCalledTimes(1)
    expect(localErrorResponse instanceof Response).toBeTruthy()
    expect(handleError).toBeCalledTimes(0)
    expect(errorResponse instanceof Response).toBeFalsy()
  })

  test('Should be called and formated like axios', async () => {
    const res = await createNew().axios.get<typeof mock.todoOne>('todos/1')

    expect(res).toMatchObject({
      data: mock.todoOne,
    })
  })

  test('Should be called and formated like axios with transform', async () => {
    const transform = jest.fn(data => ({ data }))

    const res = await createNew({transform }).axios.get<{data: typeof mock.todoOne }>('todos/1')

    expect(res).toMatchObject({
      data: {
        data: mock.todoOne,
      },
    })
  })
})

