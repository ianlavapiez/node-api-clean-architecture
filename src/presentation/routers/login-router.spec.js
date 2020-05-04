class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
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
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = systemUnitTest.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
