/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { describe, it, beforeEach } from 'mocha'

import chai from 'chai'

import { UserService } from './service'
import { CreateUserInterface } from './interface'
import UserModel from './model'

const { expect } = chai

const sampleUser: CreateUserInterface = {
  age: 20,
  email: 'someone@example.com',
  firstName: 'yash',
  lastName: 'verma',
  password: '12345',
}

describe('user.service', () => {
  it('should be defined', () => {
    expect(UserService).to.not.be.undefined
  })

  describe('.create()', () => {
    beforeEach(async () => {
      await UserModel.deleteMany({})
    })

    it('shoudl be defined', () => {
      expect(UserService.create).not.to.be.undefined
    })

    it('should create a new user with all details', async () => {
      const newUser = await UserService.create(sampleUser)

      expect(newUser).not.to.be.undefined
      expect(newUser._id).not.to.be.undefined
      expect(newUser.firstName).to.equal(sampleUser.firstName)
    })

    it('should deny creation if required fields not present', async () => {
      const newUserProcess = async () => {
        const newUser = await UserService.create({ ...sampleUser, firstName: '' })
      }

      expect(newUserProcess).to.throw
    })
  })

  describe('.findAll()', () => {
    it('shoudl be defined', () => {
      expect(UserService.findAll).not.to.be.undefined
    })
  })

  describe('.findOneByEmail()', () => {
    it('shoudl be defined', () => {
      expect(UserService.findOneByEmail).not.to.be.undefined
    })
  })

  describe('.deleteUserByEmail', () => {
    it('shoudl be defined', () => {
      expect(UserService.deleteUserByEmail).not.to.be.undefined
    })
  })
})
