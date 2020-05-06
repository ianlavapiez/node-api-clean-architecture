const validator = require('validator')

const EmailValidator = require('./email-validator')
const MissingParamError = require('./errors/missing-param-error')

const makeSystemUnderTest = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('should return true if validator returns true', () => {
    const systemUnitTest = makeSystemUnderTest()
    const isEmailValid = systemUnitTest.isValid('valid_email@gmail.com')

    expect(isEmailValid).toBe(true)
  })

  test('should return false if validator returns false', () => {
    validator.isEmailValid = false

    const systemUnitTest = makeSystemUnderTest()
    const isEmailValid = systemUnitTest.isValid('invalid_email')

    expect(isEmailValid).toBe(false)
  })

  test('should call validator with correct email', () => {
    const systemUnitTest = makeSystemUnderTest()
    systemUnitTest.isValid('any_email@email.com')

    expect(validator.email).toBe('any_email@email.com')
  })

  test('should throw if no email is provided', async () => {
    const systemUnderTest = makeSystemUnderTest()

    expect(() => { systemUnderTest.isValid() }).toThrow(new MissingParamError('email'))
  })
})
