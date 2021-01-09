require('../lib/cjs/server')
const { createClient } = require('../lib/cjs/index')

const client = createClient({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  before: () => new Promise(resolve => setTimeout(() => {
    console.log('before call')
    resolve()
  }, 1300)),
})

;(async () => {
  const res = await client.get('todos/1')
  console.log('res', res)
})()
