require('chai').should()
const { expect, should } = require('chai')
const sinon = require('sinon')
const { createChat, deleteChatRoom, getAllChat, getChat } = require('../src/controllers/chat')
const { updateIsLatest, getChatForDelete, getDeleteChatRoomForNonNull, newDeleteChatRoom, newDeleteChatRoomForNonNull } = require('../src/models/chat')
const time = require('../src/helpers/time')

const chai = require('chai')
const supertest = require('supertest')
chai.should()


const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('Chat: send chat to others', () => {

  it('same id as signed user', async() => {
    let req = {
      authUser: {
        result: [
          {
            id: 173
          }
        ]
      },
      socket: {
        emit: () => {}
      },
      body: {
        sender_id: 173,
        recipient_id: 173,
        message: 'ok computer',
        isLatest: 1
      }
    }

    req.socket.emit(173, {
      sender: 173,
      senderData: 'data',
      recipient: 173,
      message: 'ok computer',
    })

    const res = mockingResponse()
    const send = await createChat(req, res)
    await updateIsLatest(0, req.body.sender_id, parseInt(req.body.recipient_id))
    send.json.args[0][0].data.should.to.be.equal('Internal Server Error')
    send.status.args[0][0].should.to.be.equal(400)
    expect(send.json.args[0][0].result).to.be.false
  })

  it('success sending chat', async() => {
    let req = {
      authUser: {
        result: [
          {
            id: 173
          }
        ]
      },
      socket: {
        emit: () => {}
      },
      body: {
        sender_id: 173,
        recipient_id: 138,
        message: 'ok computer',
        isLatest: 1
      },
    }

    req.socket.emit(138, {
        sender: 173,
        senderData: 'data',
        recipient: 138,
        message: 'ok computer',
      })
    
    const res = mockingResponse()
      
    await updateIsLatest(0, req.body.sender_id, parseInt(req.body.recipient_id))
    const send = await createChat(req, res)
    expect(send.status.args[0][0]).equal(200)
    expect(send.json.args[0][0].result).to.be.true
  })

})

describe('Chat: delete chat room', () => {

  it('delete chat room', async() => {
    const req = {
      authUser: {
        result: [
          {
            id: 173
          }
        ]
      },
      body: {
        deleted_at: time.now(),
      },
      params: {
        id: 138
      }
    }
    const res = mockingResponse()
    // const result = await getChatForDelete(173, req.params.id)
    // const other = await getDeleteChatRoomForNonNull(173, req.params.id)
    // if (result.length > 0) {
    //   await newDeleteChatRoom({
    //     deleted_at: req.body.deleted_at,
    //     deleted_by: 173
    //   }, 173, req.params.id, (err, data) => {
    //     data.ResultHeader.should.to.be.a('object')
    //   })
    // }
    // if (other.length > 0) {
    //   await newDeleteChatRoomForNonNull({
    //     deleted_at: req.body.deleted_at,
    //     deleted_by: 'both deleted'
    //   }, (173, req.params.id), (err, data) => {
    //     data.ResultHeader.should.to.be.a('object')

    //   })
    // }
    const deleteChat =  await deleteChatRoom(req, res)
    expect(deleteChat.json.args[0][0].result).to.be.true
  })

})

describe('Chat: get all chat', () => {

  it('success get all chat', async () => {
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
    getAllChat(req, res).then((data) => {
      expect(data.status.args[0][0]).equal(200)
    }).catch((err) => {
      err.status.args[0][0].should.to.be.equal(500)
    })
  })

})

describe('Chat: get chat room', () => {

  it('get specific chat room', (done) => {
    const req = {
      authUser: {
        result: [
          {
            id: 173
          }
        ]
      },
      params: {
        recipient: 138
      }
    }
    const res = mockingResponse()
    getChat(req, res).then((data) => {
      expect(data.status.args[0][0]).equal(200)
    }).catch((err) => {
      err.status.args[0][0].should.to.be.equal(500)
    })
    done()
  })

})