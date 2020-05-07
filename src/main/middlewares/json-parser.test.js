const request = require('supertest')
const app = require('../config/app')

describe('JSON Parser middleware', () => {
  test('should parse body as JSON', async () => {
    app.post('/test_json_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_json_parser')
      .send({ name: 'Ian' })
      .expect({ name: 'Ian' })
  })
})
