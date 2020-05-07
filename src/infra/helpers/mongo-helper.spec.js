const systemUnderTest = require('./mongo-helper')

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await systemUnderTest.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await systemUnderTest.disconnect()
  })

  test('should reconnect when getDb is invoked and client is disconnected', async () => {
    expect(systemUnderTest.db).toBeTruthy()

    await systemUnderTest.disconnect()
    expect(systemUnderTest.db).toBeFalsy()

    await systemUnderTest.getDb()
    expect(systemUnderTest.db).toBeTruthy()
  })
})
