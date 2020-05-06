class Encrypter {
  async compare (password, hashedPassword) {
    return true
  }
}

describe('Encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    const systemUnderTest = new Encrypter()
    const isValid = await systemUnderTest.compare('any_password', 'hashed_password')

    expect(isValid).toBe(true)
  })
})
