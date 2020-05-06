const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = bcrypt.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    const systemUnderTest = new Encrypter()
    const isValid = await systemUnderTest.compare('any_value', 'hashed_value')

    expect(isValid).toBe(true)
  })

  test('should return false if bcrypt returns false', async () => {
    const systemUnderTest = new Encrypter()

    bcrypt.isValid = false

    const isValid = await systemUnderTest.compare('any_value', 'hashed_value')

    expect(isValid).toBe(false)
  })

  test('should call bcrypt with correct values', async () => {
    const systemUnderTest = new Encrypter()

    await systemUnderTest.compare('any_value', 'hashed_value')

    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })
})
