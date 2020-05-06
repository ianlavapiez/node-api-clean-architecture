const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()

  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId

      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()

  tokenGeneratorSpy.accessToken = 'any_token'

  return tokenGeneratorSpy
}

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email

      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()

  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeSystemUnderTest = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const tokenGeneratorSpy = makeTokenGenerator()

  const systemUnderTest = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    systemUnderTest,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
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
    const systemUnderTest = new AuthUseCase({})
    const promise = systemUnderTest.auth('any_email@gmail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('should throw if LoadUserByEmailRepository has no load method', async () => {
    const systemUnderTest = new AuthUseCase({ loadUserByEmailRepository: {} })
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
    const { systemUnderTest, encrypterSpy } = makeSystemUnderTest()

    encrypterSpy.isValid = false

    const accessToken = await systemUnderTest.auth('valid_email@gmail.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct values', async () => {
    const { systemUnderTest, loadUserByEmailRepositorySpy, encrypterSpy } = makeSystemUnderTest()
    await systemUnderTest.auth('any_email@gmail.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('should call TokenGenerator with correct userId', async () => {
    const { systemUnderTest, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSystemUnderTest()
    await systemUnderTest.auth('valid_email@gmail.com', 'valid_password')

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('should return an accessToken if correct credentials are provided', async () => {
    const { systemUnderTest, tokenGeneratorSpy } = makeSystemUnderTest()
    const accessToken = await systemUnderTest.auth('valid_email@gmail.com', 'valid_password')

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
