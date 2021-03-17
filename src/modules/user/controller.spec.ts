/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { describe, it, beforeEach, afterEach } from 'mocha'

import chai from 'chai'
import spies from 'chai-spies'

import { UserService } from './service'
import { CreateUserInterface } from './interface'
import UserModel from './model'
import { UserController } from './controller'

chai.use(spies)
const { expect } = chai
const sandbox = chai.spy.sandbox()
/**
 * List of users to use in tests
 */
const user: Array<CreateUserInterface> = [
  {
    age: 20,
    email: 'some1@example.com',
    firstName: 'some 1',
    lastName: 'user',
    password: '12345',
  },
  {
    age: 21,
    email: 'some2@example.com',
    firstName: 'some 2',
    lastName: 'user',
    password: '12345',
  },
  {
    age: 22,
    email: 'some3@example.com',
    firstName: 'some 3',
    lastName: 'user',
    password: '12345',
  },
  {
    age: 23,
    email: 'some4@example.com',
    firstName: 'some 4',
    lastName: 'user',
    password: '12345',
  },
]

describe('user.controller', () => {
  beforeEach(() => {
    UserModel.deleteMany({})
    sandbox.on(UserService, ['findAll', 'findOneByEmail', 'create', 'deleteUserByEmail'])
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should be defined', () => {
    expect(UserController).not.to.be.undefined
  })

  describe('.getAllUsers()', () => {
    it('should be defined', () => {
      expect(UserController.getAllUsers).not.to.be.undefined
    })

    it('should call UserService.findAll()', async () => {
      const userList = await UserController.getAllUsers()
      expect(UserService.findAll).to.have.been.called()
    })
  })

  describe('.getUser()', () => {
    it('should be defined', () => {
      expect(UserController.getUser).not.to.be.undefined
    })

    it('should call UserService.getUser(email)', async () => {
      const newUser = await UserService.create(user[0])
      const details = await UserController.getUser(user[0].email)
      expect(UserService.findOneByEmail).to.have.been.called.with(user[0].email)
    })

    it('should throw error if user not found', async () => {
      try {
        const details = await UserController.getUser(user[0].email)
      } catch (e) {
        expect(e).to.not.be.undefined
        expect(UserService.findOneByEmail).to.have.been.called.with(user[0].email)
        expect(UserController.getUser).to.throw()
      }
    })
  })

  describe('.createUser()', () => {
    it('should be defined', () => {
      expect(UserController.createUser).not.to.be.undefined
    })

    it('should call UserService.create()', async () => {
      const newUser = await UserController.createUser(user[1])
      expect(UserService.findOneByEmail).to.have.been.called.with(user[1].email)
      expect(UserService.create).to.have.been.called.with(user[1])
    })

    it('should throw error if user already exists', async () => {
      try {
        const newUser = await UserController.createUser(user[1])
        expect(UserService.findOneByEmail).to.have.been.called.with(user[1].email)
        expect(UserService.create).not.to.have.been.called()
      } catch (e) {
        expect(e).to.not.be.undefined
      }
    })
  })

  describe('.deleteUser()', () => {
    it('should be defined', () => {
      expect(UserController.deleteUser).not.to.be.undefined
    })

    it('should call UserService.delete()', async () => {
      const deleteOperation = await UserController.deleteUser(user[0].email)
      expect(UserService.deleteUserByEmail).to.have.been.called.with(user[0].email)
    })
  })
})
