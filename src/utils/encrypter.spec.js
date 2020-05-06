const bcrypt = require('bcrypt')

const Encrypter = require('./encrypter')
const MissingParamError = require('./errors/missing-param-error')

const makeSystemUnderTest = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const isValid = await systemUnderTest.compare('any_value', 'hashed_value')

    expect(isValid).toBe(true)
  })

  test('should return false if bcrypt returns false', async () => {
    const systemUnderTest = makeSystemUnderTest()

    bcrypt.isValid = false

    const isValid = await systemUnderTest.compare('any_value', 'hashed_value')

    expect(isValid).toBe(false)
  })

  test('should call bcrypt with correct values', async () => {
    const systemUnderTest = makeSystemUnderTest()

    await systemUnderTest.compare('any_value', 'hashed_value')

    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })

  test('should throw if no params are provided', async () => {
    const systemUnderTest = makeSystemUnderTest()

    expect(systemUnderTest.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(systemUnderTest.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
