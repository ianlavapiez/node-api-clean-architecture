const MongoHelper = require('../helpers/mongo-helper')

let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should update the user with the given accessToken', async () => {
    const userModel = db.collection('users')
    const systemUnderTest = new UpdateAccessTokenRepository(userModel)
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@gmail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })

    await systemUnderTest.update(fakeUser.ops[0]._id, 'valid_token')

    const updatedFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })

    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('should throw if no userModel is provided', async () => {
    const systemUnderTest = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@gmail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })

    const promise = systemUnderTest.update(fakeUser.ops[0]._id, 'valid_token')

    expect(promise).rejects.toThrow()
  })
})
