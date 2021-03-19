/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */

import { describe, it, before } from 'mocha'
import chai from 'chai'
import chaiHttpHandler from 'chai-http'
import config from 'config'

import app from '../../src/app'
import { UserService } from '../../src/modules/user/service'
import { logger } from '../../src/services/logger/winston'
import UserModel from '../../src/modules/user/model'

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
 * Rights with user are :
 * controller
 *      .grant(ROLE.USER)
 *      .extend(ROLE.VISITOR)
 *      .readOwn('profile')
 *      .deleteOwn('profile')
 */
describe('auth', () => {
  let cookieData: string

  before(async () => {
    await UserModel.deleteMany({}).then(() =>
      Promise.all([UserService.create(user[0]), UserService.create(user[1])]),
    )
  })

  it('should allow a valid user to log in', () => {
    chai
      .request(app)
      .post(`/auth/login`)
      .send({ email: user[0].email, password: user[0].password })
      .end(async (err, res) => {
        expect(res.body.error).not.to.be.true
        expect(res.body.payload.token).to.be.string
        cookieData = res.body.payload.token
      })
  })

  it('should not allow invalid credentials to log in', () => {
    chai
      .request(app)
      .post(`/auth/login`)
      .send({ email: user[0].email, password: 'some random passwd' })
      .end(async (err, res) => {
        expect(res.body.error).to.be.true
      })
  })

  it('should reset cookie on logout', () => {
    chai
      .request(app)
      .get(`/auth/logout`)
      .set(config.get('login_token.cookie'), cookieData)
      .send({ email: user[0].email, password: 'some random passwd' })
      .end(async (err, res) => {
        console.log(res)
        expect(res.body.error).not.to.be.true
      })
  })
})
