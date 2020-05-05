const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const ServerError = require('../helpers/server-error')

const makeSystemUnitTest = () => {
  const authUseCaseSpy = makeAuthUseCase()

  authUseCaseSpy.accessToken = 'valid_token'

  const systemUnitTest = new LoginRouter(authUseCaseSpy)

  return {
    systemUnitTest,
    authUseCaseSpy
  }
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('should return 400 if no email has provided', () => {
    const { systemUnitTest } = makeSystemUnitTest()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = systemUnitTest.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password has provided', () => {
    const { systemUnitTest } = makeSystemUnitTest()
    const httpRequest = {
      body: {
        email: 'any_email_provided@gmail.com'
      }
    }
    const httpResponse = systemUnitTest.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if no httpRequest has provided', () => {
    const { systemUnitTest } = makeSystemUnitTest()
    const httpResponse = systemUnitTest.route()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if no httpRequest has no body', () => {
    const { systemUnitTest } = makeSystemUnitTest()
    const httpResponse = systemUnitTest.route()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call authUseCaseSpy with correct params', () => {
    const { systemUnitTest, authUseCaseSpy } = makeSystemUnitTest()
    const httpRequest = {
      body: {
        email: 'any_email_provided@gmail.com',
        password: 'any_password'
      }
    }

    systemUnitTest.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  })

  test('should return 401 when invalid credentials are provided', () => {
    const { systemUnitTest, authUseCaseSpy } = makeSystemUnitTest()

    authUseCaseSpy.accessToken = null

    const httpRequest = {
      body: {
        email: 'invalid_email@gmail.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = systemUnitTest.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('should return 200 when valid credentials are provided', () => {
    const { systemUnitTest, authUseCaseSpy } = makeSystemUnitTest()
    const httpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = systemUnitTest.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('should return 500 if no AuthUseCase has provided', () => {
    const systemUnitTest = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = systemUnitTest.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if authUseCase has no auth', () => {
    const systemUnitTest = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = systemUnitTest.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if authUseCase throws', () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const systemUnitTest = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = systemUnitTest.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
