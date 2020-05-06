const { MissingParamError } = require('../../utils/errors')
class AuthUseCase {
  constructor (loadUserByEmailRepositorySpy) {
    this.loadUserByEmailRepositorySpy = loadUserByEmailRepositorySpy
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    this.loadUserByEmailRepositorySpy.load(email)
  }
}

const makeSystemUnderTest = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const systemUnderTest = new AuthUseCase(loadUserByEmailRepositorySpy)

  return {
    systemUnderTest,
    loadUserByEmailRepositorySpy
  }
}

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const promise = systemUnderTest.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw if no password is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const promise = systemUnderTest.auth('any_email@gmail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should  call LoadUserByEmailRepository with correct email', async () => {
    const { systemUnderTest, loadUserByEmailRepositorySpy } = makeSystemUnderTest()

    systemUnderTest.auth('any_email@gmail.com', 'any_password')

    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@gmail.com')
  })
})
