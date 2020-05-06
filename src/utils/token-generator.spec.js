const jwt = require('jsonwebtoken')

const MissingParamError = require('./errors/missing-param-error')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }

    if (!id) {
      throw new MissingParamError('id')
    }

    return jwt.sign(id, this.secret)
  }
}

const makeSystemUnderTest = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  test('should return null if JWT returns null', async () => {
    const systemUnderTest = makeSystemUnderTest()

    jwt.token = null

    const token = await systemUnderTest.generate('any_id')

    expect(token).toBeNull()
  })

  test('should return a token if JWT returns token', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const token = await systemUnderTest.generate('any_token')

    expect(token).toBe(jwt.token)
  })

  test('should call JWT with correct values', async () => {
    const systemUnderTest = makeSystemUnderTest()

    await systemUnderTest.generate('any_id')

    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(systemUnderTest.secret)
  })

  test('should throw if no secret is provided', async () => {
    const systemUnderTest = new TokenGenerator()
    const promise = systemUnderTest.generate('any_id')

    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('should throw if no id is provided', async () => {
    const systemUnderTest = new TokenGenerator('secret')
    const promise = systemUnderTest.generate()

    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
