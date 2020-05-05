const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')

const makeSystemUnitTest = () => {
  return new LoginRouter()
}

describe('Login Router', () => {
  test('should return 400 if no email has provided', () => {
    const systemUnitTest = makeSystemUnitTest()
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
    const systemUnitTest = makeSystemUnitTest()
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
    const systemUnitTest = makeSystemUnitTest()
    const httpResponse = systemUnitTest.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if no httpRequest has no body', () => {
    const systemUnitTest = makeSystemUnitTest()
    const httpResponse = systemUnitTest.route({})

    expect(httpResponse.statusCode).toBe(500)
  })
})
