/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */

import { describe, it, before } from 'mocha'
import chai from 'chai'
import chaiHttpHandler from 'chai-http'
import app from '../../src/app'
import { UserService } from '../../src/modules/user/service'
import { logger } from '../../src/services/logger/winston'

import UserModel from '../../src/modules/user/model'
import { ROLE } from '../../src/services/roles/types'

chai.use(chaiHttpHandler)
const { expect } = chai

/** silent the logs */
logger.transports.forEach((t: any) => (t.silent = true))

/**
 * List of users to use in tests
 */
const user = [
  {
    age: 20,
    email: 'test_user_1@example.com',
    firstName: 'test_user 1',
    lastName: 'user',
    password: '12345',
  },
  {
    age: 21,
    email: 'test_user_2@example.com',
    firstName: 'test_user 2',
    lastName: 'user',
    password: '12345',
  },
  {
    age: 22,
    email: 'test_user_3@example.com',
    firstName: 'test_user 3',
    lastName: 'user',
    password: '12345',
  },
  {
    age: 23,
    email: 'test_user_4@example.com',
    firstName: 'test_user 4',
    lastName: 'user',
    password: '12345',
  },
]

/**
 * Rights with visitor are to only create their own profile, nothing else.
 * controller
 *      .grant(ROLE.VISITOR)
 *      .createOwn('profile')
 */
describe('visitor', () => {
  before(async () => {
    await UserModel.deleteMany({})
    await Promise.all([
      UserService.create(user[0]),
      UserService.create(user[1]),
      UserService.create(user[2]),
    ])
    logger.info('e2e.visitor.sample.user.inserted')
  })

  it('should not be allowed to list of all users', () => {
    chai
      .request(app)
      .get('/user')
      .end((err, res) => {
        expect(res.body.error).to.be.true
        expect(res.body.code).to.be.equal(403)
      })
  })

  it('should not be allowed to view detail of individual profile', () => {
    chai
      .request(app)
      .get(`/user/${user[0].email}`)
      .end((err, res) => {
        expect(res.body.error).to.be.true
        expect(res.body.code).to.be.equal(403)
      })
  })

  it('should not be allowed to delete any user', () => {
    chai
      .request(app)
      .delete(`/user/${user[0].email}`)
      .end((err, res) => {
        expect(res.body.error).to.be.true
        expect(res.body.code).to.be.equal(403)
      })
  })

  it('should be allowed to create a new profile', () => {
    chai
      .request(app)
      .post(`/user`)
      .send(user[3])
      .end(async (err, res) => {
        expect(res.body.error).not.to.be.true
        expect(res.body.payload.email).to.equal(user[3].email)
        expect(res.body.payload.role).to.equal(ROLE.USER)
      })
  })
})
