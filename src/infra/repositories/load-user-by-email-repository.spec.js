const { MongoClient } = require('mongodb')

const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let client, db

const makeSystemUnderTest = () => {
  const userModel = db.collection('users')
  const systemUnderTest = new LoadUserByEmailRepository(userModel)

  return {
    systemUnderTest,
    userModel
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    db = client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  test('should return null if no user is found', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const user = await systemUnderTest.load('invalid_email@gmail.com')

    expect(user).toBeNull()
  })

  test('should return user if user is found', async () => {
    const { systemUnderTest, userModel } = makeSystemUnderTest()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@gmail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'any_password'
    })

    const user = await systemUnderTest.load('valid_email@gmail.com')

    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })
})
