/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { describe, it, beforeEach, before, after } from 'mocha'

import chai from 'chai'

import { UserService } from './service'
import { CreateUserInterface } from './interface'
import UserModel from './model'
import { NotFoundException } from 'http-exception-transformer/exceptions'

const { expect } = chai

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

describe('user.service', () => {
  /** clear database before running tests  */
  beforeEach(async () => {
    await UserModel.deleteMany({})
  })

  it('should be defined', () => {
    expect(UserService).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should be defined', () => {
      expect(UserService.create).not.to.be.undefined
    })

    it('should create a new user with all details', async () => {
      const newUser = await UserService.create(user[0])

      expect(newUser).not.to.be.undefined
      expect(newUser._id).not.to.be.undefined
      expect(newUser.firstName).to.equal(user[0].firstName)
    })

    it('should deny creation if required fields not present', async () => {
      const newUserProcess = async () => {
        const newUser = await UserService.create({ ...user[0], firstName: '' })
      }
      expect(newUserProcess).to.throw
    })

    it('should deny creation if user with email already exists', async () => {
      const newUserProcess = async () => {
        const newUser = await UserService.create(user[0])
      }
      expect(newUserProcess).to.throw
    })
  })

  describe('.findAll()', () => {
    after(() => {
      UserModel.deleteMany({})
    })

    it('shoudl be defined', () => {
      expect(UserService.findAll).not.to.be.undefined
    })

    it('should return empty array if no user in database', async () => {
      const userList = await UserService.findAll()
      expect(userList).to.have.lengthOf(0)
    })

    it('should return n when n users created', async () => {
      const userOperations = await Promise.all([
        UserService.create(user[0]),
        UserService.create(user[1]),
        UserService.create(user[2]),
        UserService.create(user[3]),
      ])

      expect(userOperations).to.have.lengthOf(4)
    })

    it('should not display user password', async () => {
      const createdUser = await UserService.create(user[0])
      const userList = await UserService.findAll()
      expect(userList[0].password).to.be.undefined
    })
  })

  describe('.findOneByEmail()', () => {
    it('shoudl be defined', () => {
      expect(UserService.findOneByEmail).not.to.be.undefined
    })

    it('should return null if user not found', async () => {
      const searchedUser = await UserService.findOneByEmail('somerandomemail@gmail.com')
      expect(searchedUser).to.be.null
    })

    it('should return user details if user is found', async () => {
      await UserService.create(user[0])
      const searchedUser = await UserService.findOneByEmail(user[0].email)
      expect(searchedUser).not.to.be.null
    })

    it('should not list user passwords', async () => {
      await UserService.create(user[0])
      const searchedUser = await UserService.findOneByEmail(user[0].email)
      expect(searchedUser?.password).to.be.undefined
    })

    it('should not list user _id', async () => {
      await UserService.create(user[0])
      const searchedUser = await UserService.findOneByEmail(user[0].email)
      expect(searchedUser?._id).to.be.undefined
    })
  })

  describe('.deleteUserByEmail()', () => {
    it('shoudl be defined', () => {
      expect(UserService.deleteUserByEmail).not.to.be.undefined
    })

    it('should delete user if email matches', async () => {
      let userList = await UserService.findAll()
      expect(userList).to.have.lengthOf(0)

      const newUser = await UserService.create(user[0])
      userList = await UserService.findAll()
      expect(userList).to.have.lengthOf(1)

      const deleteUser = await UserService.deleteUserByEmail(user[0].email)
      userList = await UserService.findAll()
      expect(userList).to.have.lengthOf(0)
    })
  })

  describe('.findOneByEmailAndPassword()', () => {
    it('should be defined', () => {
      expect(UserService.findOneByEmailAndPassword).not.to.be.undefined
    })

    it('should return details if valid email and password supplied', async () => {
      const newUser = await UserService.create(user[0])
      const result = await UserService.findOneByEmailAndPassword(user[0].email, user[0].password)
      expect(result).not.to.be.null
      expect(result.firstName).to.be.equal(user[0].firstName)
    })

    it('should not return user password', async () => {
      const newUser = await UserService.create(user[0])
      const result = await UserService.findOneByEmailAndPassword(user[0].email, user[0].password)
      expect(result.password).to.be.undefined
    })

    it('should throw an exception if does not match', async () => {
      try {
        const result = await UserService.findOneByEmailAndPassword('foo', 'bar')
      } catch (e) {
        expect(e).not.to.be.undefined
      }
    })
  })
})
