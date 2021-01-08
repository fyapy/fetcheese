require('../lib/cjs/server')
const { createClient } = require('../lib/cjs/index')

const client = createClient({
  baseURL: 'https://jsonplaceholder.typicode.com/'
})

;(async () => {
  const res = await client.get('todos/1')
  console.log('res', res)
})()
