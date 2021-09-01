// const { expect } = require('chai')
// const sinon = require('sinon')
// const supertest = require('supertest')

// const { APP_URL } = process.env

// describe('Transaction: create transaction', () => {
  
//   it('success', (done) => {
//     supertest(APP_URL)
//     .post('/auth/signin')
//     .send('username=user20@mail.com&password=12345678')
//     .expect(200)
//     .end((err, res) => {
//       const { token, refreshToken } = res.body.data
      
//       supertest(APP_URL)
//       .post('/auth/refresh-token')
//       .set('Authorization', `Bearer ${token}`)
//       .send(`refreshToken=${refreshToken}`)
//       .expect(200)
//       .end((error, response) => {
//         const newRefreshToken = response.body.data.token
//         supertest(APP_URL)
//         .post('/auth/fcm-token')
//         .set('Authorization', `Bearer ${newRefreshToken}`)
//         .send('token=fcmToken123abc')
//         .expect(200)

//       })
//     })
//   })

// })