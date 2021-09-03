require('chai').should()
const { expect } = require('chai')
const sinon = require('sinon')

const { getUserById, getUserSigned, updateUserInfo, confirmPassword, updatePassword } = require('../src/controllers/userController')


const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('User: get signed user', () => {

  it('user not found', async () => {
    const req = {
      query: {
        search: 'search not found user'
      }
    }
    const res = mockingResponse()
    const searchUser = await getUserById(req, res)
    expect(searchUser.json.args[0][0].result).to.be.true
    expect(searchUser.json.args[0][0].pageInfo).equal(undefined)
    expect(searchUser.status.args[0][0]).to.be.equal(200)
  })

  it('user found', async () => {
    const req = {
      query: {
        search: 'Roger'
      }
    }
    const res = mockingResponse()
    const searchUser = await getUserById(req, res)
    expect(searchUser.json.args[0][0].result).to.be.true
    expect(searchUser.status.args[0][0]).to.be.equal(200)
  })

})

describe('User: get signed user', () => {

  it('success', async() => {
    const req = {
      authUser: {
        result: [
          {
            id: 173
          }
        ]
      }
    }
    const res = mockingResponse()
    const signed = await getUserSigned(req, res)
    expect(signed.status.args[0][0]).equal(200)
    expect(signed.json.args[0][0].result).to.be.true
  })

})

describe('User: update profile', () => {

  it ('choose another username / email', async() => {
    const req = {
      authUser: {
        result: [
          {
            id: 264
          }
        ]
      },
      body: {
        username: 'hellouser999@mail.com'
      }
    }
    const res = mockingResponse()
    const update = await updateUserInfo(req, res)
    expect(update.json.args[0][0].result).to.be.false
    expect(update.json.args[0][0].data).to.be.equal('email unavailable')
  })

  it ('success', async() => {
    const req = {
      authUser: {
        result: [
          {
            id: 264
          }
        ]
      },
      body: {
        username: 'user2020@mail.com'
      }
    }
    const res = mockingResponse()
    const update = await updateUserInfo(req, res)
    expect(update.status.args[0][0]).equal(200)
    expect(update.json.args[0][0].result).to.be.true
  })

})

describe('User: confirm password', () => {

  it('failed to confirm password', async () => {
    const req = {
      body: {
        password: '1234'
      },
      authUser: {
        result: [
          {
            id: 138
          }
        ]
      }
    }
    const res = mockingResponse()
    const password = await confirmPassword(req, res)
    expect(password.status.args[0][0]).equal(400)
    expect(password.json.args[0][0].result).to.be.false
    expect(password.json.args[0][0].data).to.be.equal('Password did not match to the record')
  })

  it('success to confirm password', async () => {
    const req = {
      body: {
        password: '12345678'
      },
      authUser: {
        result: [
          {
            id: 138
          }
        ]
      }
    }
    const res = mockingResponse()
    const password = await confirmPassword(req, res)
    expect(password.status.args[0][0]).equal(200)
    expect(password.json.args[0][0].result).to.be.true
  })

  describe('User: update password', () => {

    it('password length less than 8', async() => {
      const req = {
        authUser: {
          result: [
            {
              id: 138
            }
          ]
        },
        body: {
          password: '12345',
          resendPassword: '12345'
        }
      }
      const res = mockingResponse()
      const update = await updatePassword(req, res)
      expect(update.status.args[0][0]).equal(400)
      expect(update.json.args[0][0].result).to.be.false
    })

    it('resend password did not match', async() => {
      const req = {
        authUser: {
          result: [
            {
              id: 138
            }
          ]
        },
        body: {
          password: '12345678',
          resendPassword: '12345'
        }
      }
      const res = mockingResponse()
      const update = await updatePassword(req, res)
      expect(update.status.args[0][0]).equal(400)
      expect(update.json.args[0][0].result).to.be.false
    })

    it('success', async() => {
      const req = {
        authUser: {
          result: [
            {
              id: 138
            }
          ]
        },
        body: {
          password: '12345678',
          resendPassword: '12345678'
        }
      }
      const res = mockingResponse()
      const update = await updatePassword(req, res)
      expect(update.status.args[0][0]).equal(200)
      expect(update.json.args[0][0].result).to.be.true
    })

  })

})