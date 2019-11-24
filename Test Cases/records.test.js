var superTest = require('supertest')
var chai = require('chai')
var application = require('../application')

describe('Records endpoints', () => {
    it('Valid request, it should return 200', function (done) {
      superTest(application)
        .post('/records')
        .send({
          startDate: '2019-09-09',
          endDate: '2019-10-10',
          minCount: 1500,
          maxCount: 2000
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          chai.assert.equal(res.body.code, 0)
          chai.assert.equal(res.body.msg, 'Success')
          done()
        })
    })

    it('invalid date data should return 400 with message bad request', async () => {
      const result = await superTest(application)
        .post('/records')
        .send({
          startDate: '2019-00-11',
          endDate: '2019-12-58',
          minCount: 1000,
          maxCount: 2500
        })
      chai.assert.equal(result.status, 400)
      chai.assert(result.body.msg, 'bad request, invalid data')
    })

    
  })
  