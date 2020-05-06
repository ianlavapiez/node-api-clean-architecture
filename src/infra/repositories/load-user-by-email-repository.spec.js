class LoadUserByEmailRepository {
  async load (email) {
    return null
  }
}

describe('LoadUserByEmail Repository', () => {
  test('should return null if no user is found', async () => {
    const systemUnderTest = new LoadUserByEmailRepository()
    const user = await systemUnderTest.load('invalid_email@gmail.com')

    expect(user).toBeNull()
  })
})
