const { expect } = require('chai')
const assert = require('assert')
const sinon = require('sinon')
const supertest = require('supertest')

let { signUp, signIn, refreshToken, registerToken } = require('../src/controllers/authController')

const { APP_URL } = process.env

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('Auth: sign up', () => {

  it('email unavailable', (done) => {
    supertest(APP_URL)
    .post('/auth/signup')
    .send('name=user&username=user20@mail.com&password=12345678')
    .expect(400)
    .end((err, res) => {
      expect(res.body.result).to.be.false
      expect(res.body.data).equal('email unavailable, please input another one')
      done()
    })
  })

  it (`password can't be less than 8 characters`, (done) => {
    supertest(APP_URL)
    .post('/auth/signup')
    .send('name=user&username=user889@mail.com&password=123')
    .expect(400)
    .end((err, res) => {
      expect(res.body.result).to.be.false
      expect(res.body.data).equal('password must be 8 or greater characters long')
      done()
    })
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
      const { token, refreshToken } = signin.json.args[0][0].data
      expect(signin.status.args[0][0]).to.be.equal(200)
      expect(signin.json.args[0][0].result).to.be.true
      // expect(signin.status.args[0][0].result).to.be.true
        supertest(APP_URL)
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${token}`)
        .send(`refreshToken=${refreshToken}`)
        .end(async (err, res) => {
          expect(res.body.result).to.be.true
          expect(res.body.data.token).to.be.a('string')
          const varToken = res.body.data.token

          let fcmReq = {
            body: {
              token: 'stringToken123'
            },
            headers: {
              Authorization: varToken
            }
          }
          const fcm = await registerToken(fcmReq, response)
          console.log(fcm, 'test 123')
        })

    })
  })