class LoginRouter {
  route (httpRequest) {
    const { email, password } = httpRequest.body

    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
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
  })
})
