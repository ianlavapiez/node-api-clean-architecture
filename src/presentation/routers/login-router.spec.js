class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return httpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) {
      return httpResponse.badRequest('email')
    }

    if (!password) {
      return httpResponse.badRequest('password')
    }
  }
}

class httpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}

class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing param: ${paramName}`)

    this.name = 'MissingParamError'
  }
}

describe('Login Router', () => {
  test('should return 400 if no email has provided', () => {
    const systemUnitTest = new LoginRouter()
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
    const systemUnitTest = new LoginRouter()
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
    const systemUnitTest = new LoginRouter()
    const httpResponse = systemUnitTest.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if no httpRequest has no body', () => {
    const systemUnitTest = new LoginRouter()
    const httpResponse = systemUnitTest.route({})

    expect(httpResponse.statusCode).toBe(500)
  })
})
