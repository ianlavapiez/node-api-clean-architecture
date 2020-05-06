class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new Error()
    }
  }
}

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const systemUnderTest = new AuthUseCase()
    const promise = await systemUnderTest.auth()

    expect(promise).rejects.toThrow()
  })
})
