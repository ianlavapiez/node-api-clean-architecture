const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('should return true if validator returns true', () => {
    const systemUnitTest = new EmailValidator()
    const isEmailValid = systemUnitTest.isValid('valid_email@gmail.com')

    expect(isEmailValid).toBe(true)
  })

  test('should return false if validator returns false', () => {
    validator.isEmailValid = false

    const systemUnitTest = new EmailValidator()
    const isEmailValid = systemUnitTest.isValid('invalid_email')

    expect(isEmailValid).toBe(false)
  })
})
