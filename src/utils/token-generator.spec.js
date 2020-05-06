class TokenGenerator {
  async generate (id) {
    return null
  }
}

describe('Token Generator', () => {
  test('should return null if JWT returns null', async () => {
    const systemUnderTest = new TokenGenerator()
    const token = await systemUnderTest.generate('any_id')

    expect(token).toBeNull()
  })
})
