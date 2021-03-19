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
import { AuthController } from '../../src/modules/auth/controller'
import { ROLE } from '../../src/services/roles/types'

chai.use(chaiHttpHandler)
const { expect } = chai

/** silent the logs */
logger.transports.forEach((t: any) => (t.silent = false))

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
    role: ROLE.ADMIN,
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
 * Rights with moderators:
 * controller
 *      .grant(ROLE.ADMIN)
 *      .extend(ROLE.MOD)
 *      .deleteAny('profile')
 */
describe('admin', () => {
  let cookie: string

  before(async () => {
    await UserModel.deleteMany({})
    await Promise.all([UserService.create(user[0]), UserService.create(user[1])])

    const { token } = await AuthController.login({
      email: user[0].email,
      password: user[0].password,
    })

    cookie = `${config.get('login_token.cookie')}=${token}`
  })

  it('should be allowed to list details of all users', () => {
    chai
      .request(app)
      .get('/user')
      .set('Cookie', cookie)
      .end((err, res) => {
        expect(res.body.error).not.to.be.true
        expect(res.body.code).to.be.equal(200)
        expect(res.body.payload).to.have.length.greaterThan(1)
      })
  })

  it('should be allowed to view detail of other profiles', () => {
    chai
      .request(app)
      .get(`/user/${user[1].email}`)
      .set('Cookie', cookie)
      .end((err, res) => {
        expect(res.body.error).not.to.be.true
        expect(res.body.code).to.be.equal(200)
        expect(res.body.payload.email).to.be.equal(user[1].email)
      })
  })

  it('should be allowed to view detail of own profile', () => {
    chai
      .request(app)
      .get(`/user/${user[0].email}`)
      .set('Cookie', cookie)
      .end((err, res) => {
        expect(res.body.code).to.be.equal(200)
        expect(res.body.error).not.to.be.true
        expect(res.body.payload.email).to.be.equal(user[0].email)
        expect(res.body.payload.role).to.be.equal(ROLE.ADMIN)
      })
  })

  it('should be allowed to delete any other user', () => {
    chai
      .request(app)
      .delete(`/user/${user[1].email}`)
      .set('Cookie', cookie)
      .end((err, res) => {
        expect(res.body.error).not.to.be.true
        expect(res.body.code).to.be.equal(200)
      })
  })

  it('should be allowed to delete own profile', () => {
    chai
      .request(app)
      .delete(`/user/${user[0].email}`)
      .set('Cookie', cookie)
      .end((err, res) => {
        expect(res.body.error).not.to.be.true
        expect(res.body.code).to.be.equal(200)
      })
  })
})
