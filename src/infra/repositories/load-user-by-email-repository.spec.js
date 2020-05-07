const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')

let db

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
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
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
      password: 'hashed_password'
    })

    const user = await systemUnderTest.load('valid_email@gmail.com')

    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  test('should throw if no userModel is provided', async () => {
    const systemUnderTest = new LoadUserByEmailRepository()
    const promise = systemUnderTest.load('any_email@gmail.com')

    expect(promise).rejects.toThrow()
  })

  test('should throw if no email is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const promise = systemUnderTest.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
