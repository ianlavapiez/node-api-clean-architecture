const { MongoClient } = require('mongodb')

let client, db

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })

    return user
  }
}

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

    await userModel.insertOne({
      email: 'valid_email@gmail.com'
    })

    const user = await systemUnderTest.load('valid_email@gmail.com')

    expect(user.email).toBe('valid_email@gmail.com')
  })
})
