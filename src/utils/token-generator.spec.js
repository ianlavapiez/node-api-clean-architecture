const jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
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
})
