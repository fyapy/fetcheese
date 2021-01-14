const express = require('express')
const { join } = require('path')
const JSDOMEvironment = require('jest-environment-jsdom')

const startExpress = app => new Promise(resolve => {
  const server = app.listen(0, '127.0.0.1', () => {
    console.log(`Running server on ${JSON.stringify(server.address())}`)
    resolve(server)
  })
})

class ExpressEnvironment extends JSDOMEvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    await super.setup()
    const app = express()


    app.get('/public/big-photo.jpeg', (_req, res) => res.sendFile(join(process.cwd(), 'jest/public/big-photo.jpeg')))
    
    app
      .get('/todos/1', (_req, res) => res.json({
        userId: 1,
        id: 1,
        title: 'delectus aut autem',
        completed: false,
      }))
      .post('/posts', (_req, res) => res.json({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }))

    const server = await startExpress(app)
    const address = server.address()
    this.global.server = server
    this.global.address = `http://${address.address}:${address.port}/`
  }

  async teardown() {
    this.global.server.close()
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = ExpressEnvironment
