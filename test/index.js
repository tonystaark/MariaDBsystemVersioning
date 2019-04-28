'use strict'

const app = require('../app')
const chai = require('chai')
const request = require('supertest')
const expect = chai.expect

const data = (task) => {
  for (let i in task) {
    return {
      value: task[i],
      key: i
    }
  }
}

describe('API Integration tests', () => {
  let task = {'mykey': 'value1'}
  const initialData = data(task)
    it('should post a new key-value pair', (done) => {
      request(app)
        .post('/object')
        .send(task)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('key', initialData.key)
          expect(res.body).to.have.property('value', initialData.value)
          expect(res.body.timestamp).to.be.a('number')
          done()
        })
    })
    it('should get an object', (done) => {
      request(app)
        .get(`/object/mykey`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('value', initialData.value)
          done()
        })
    })
    it('should update an existing key with a new value', (done) => {
      task = {'mykey': 'value2'}
      const updatedData = data(task)
      request(app)
        .post('/object')
        .send(task)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('key', updatedData.key)
          expect(res.body).to.have.property('value', updatedData.value)
          expect(res.body.timestamp).to.be.a('number')
          task = res.body
          done()
        })
    })
    it('should return another key value pair with the new value', (done) => {
      request(app)
        .get(`/object/mykey`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('value', task.value)
          done()
        })
    })
    it('should get the value updated on the specified timestamp', (done) => {
      request(app)
        .get(`/object/mykey?timestamp=${task.timestamp}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('value', 'value2')
          done()
        })
    })
    it('should get the most recent value if the specified timestamp is before the most updated one', (done) => {
      request(app)
        .get(`/object/mykey?timestamp=${task.timestamp - 0.00001}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('value', 'value1')
          done()
        })
    })
})