const MongoHelper = require('./mongo-helper')

describe('Mongo Helper', () => {
  test('should reconnect when getDb is invoked and client is disconnected', async () => {
    const systemUnderTest = MongoHelper

    await systemUnderTest.connect(process.env.MONGO_URL)
    expect(systemUnderTest.db).toBeTruthy()

    await systemUnderTest.disconnect()
    expect(systemUnderTest.db).toBeFalsy()

    await systemUnderTest.getDb()
    expect(systemUnderTest.db).toBeTruthy()
  })
})
