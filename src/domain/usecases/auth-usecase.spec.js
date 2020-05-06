const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeSystemUnderTest = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }

  const encrypterSpy = new EncrypterSpy()

  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email

      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()

  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }

  const systemUnderTest = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)

  return {
    systemUnderTest,
    loadUserByEmailRepositorySpy,
    encrypterSpy
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

  test('should throw if no LoadUserByEmailRepository is provided', async () => {
    const systemUnderTest = new AuthUseCase()
    const promise = systemUnderTest.auth('any_email@gmail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('should throw if LoadUserByEmailRepository has no load method', async () => {
    const systemUnderTest = new AuthUseCase({})
    const promise = systemUnderTest.auth('any_email@gmail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('should return null if an invalid email is provided', async () => {
    const { systemUnderTest, loadUserByEmailRepositorySpy } = makeSystemUnderTest()

    loadUserByEmailRepositorySpy.user = null

    const accessToken = await systemUnderTest.auth('invalid_email@gmail.com', 'any_password')

    expect(accessToken).toBeNull()
  })

  test('should return null if an invalid email is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const accessToken = await systemUnderTest.auth('valid_email@gmail.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct values', async () => {
    const { systemUnderTest, loadUserByEmailRepositorySpy, encrypterSpy } = makeSystemUnderTest()
    await systemUnderTest.auth('any_email@gmail.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
})
