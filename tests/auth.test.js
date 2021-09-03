const { expect } = require('chai')
const sinon = require('sinon')

let { signUp, signIn, refreshToken, registerToken } = require('../src/controllers/authController')
const { findToken } = require('../src/models/fcmToken')

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('Auth: sign up', () => {

  it('email unavailable', (done) => {
    const req = {
      body: {
        name: 'user name',
        username: 'user20@mail.com',
        password: '12345678'
      }
    }
    
    const response = mockingResponse()
    signUp(req, response).then((data) => {
      expect(data.status.args[0][0]).to.be.equal(400)
      data.status.args[0][0].result.should.to.be.false
    })
    done()
  })

  it (`password can't be less than 8 characters`, (done) => {
    const req = {
      body: {
        name: 'user name',
        username: 'user@mail.com',
        password: '12345'
      }
    }
    
    const response = mockingResponse()
    signUp(req, response).then((data) => {
      expect(data.status.args[0][0]).to.be.equal(400)
      expect(data.status.args[0][0].result).to.be.false
    })
    done()
  })

  it('failed to create account', (done) => {
    const req = {
      body: {}
    }
    
    const response = mockingResponse()
    signUp(req, response).then((data) => {
      expect(data.status.args[0][0]).to.be.equal(400)
      expect(data.status.args[0][0].result).to.be.false
    })
    done()
  })

  // it('success', (done) => {
  //   const req = {
  //     body: {
  //       name: 'user name',
  //       username: 'user@mail.com',
  //       password: '12345678'
  //     }
  //   }
    
  //   const response = mockingResponse()
  //   signUp(req, response).then((data) => {
  //     expect(data.status.args[0][0]).to.be.equal(200)
  //     expect(data.status.args[0][0].result).to.be.true
  //     expect(data.json.args[0][0].data).to.be.a('object')
  //   })
  //   done()

  //   })
  })


  describe('Auth: sign in', () => {
  
    it('email or password did not match', (done) => {
      const req = {
        body: {
          username: 'user20@mail.com',
          password: '1234'
        }
      }
      const response = mockingResponse()
      signIn(req, response).then((data) => {
        expect(data.status.args[0][0]).to.be.equal(400)
        expect(data.status.args[0][0].result).to.be.false
        expect(signin.json.args[0][0].data).to.be.equal('Email or password did not match to the record')
      })
      done()
    })
  
    it('success', async () => {
      const req = {
        body: {
          username: 'user20@mail.com',
          password: '12345678'
        }
      }
      const response = mockingResponse()
      const signin = await signIn(req, response)
      const { token, refreshToken: newRefresh } = signin.json.args[0][0].data
      const request = {
        headers: {
          Authorization: token
        },
        body: {
          refreshToken: newRefresh
        }
      }
      await refreshToken(request, response)
      expect(signin.status.args[0][0]).to.be.equal(200)
      expect(signin.json.args[0][0].result).to.be.true
    })
  })

  describe('Auth: register fcm token', () => {
    
    it('failed', async() => {
      const req = {
        body: {
          user_id: 173,
          token: 'FCMToken1234'
        }
      }
      const res = mockingResponse()
      const find = await findToken(138, res)
      if (find.length < 1) {
        await registerToken(req, res)
      }
      
    })

    it('success', (done) => {
        const req = {
          body: {
            user_id: 173,
            token: 'FCMToken1234'
          }
        }
        const res = mockingResponse()
        registerToken(req, res).then((data) => {
          console.log(data, 'test data token')
        })
        done()
    })
  })