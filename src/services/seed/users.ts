import UserModel from '../../modules/user/model'
import { logger } from '../logger/winston'
import { ROLE } from '../roles/types'

const dummyUser = (i: number, role: string) => ({
  age: 20 + i,
  email: `seed${i}@gmail.com`,
  firstName: `user${i}`,
  lastName: `octocat`,
  password: '12345',
  role,
})

const seedUsers = async () =>
  new Promise((resolve) => {
    Promise.all([
      dummyUser(0, ROLE.USER),
      dummyUser(1, ROLE.USER),
      dummyUser(2, ROLE.USER),
      dummyUser(3, ROLE.USER),
      dummyUser(4, ROLE.USER),
      dummyUser(5, ROLE.USER),
      dummyUser(6, ROLE.USER),
      dummyUser(7, ROLE.USER),
      dummyUser(8, ROLE.USER),
      dummyUser(9, ROLE.USER),
      dummyUser(10, ROLE.MOD),
      dummyUser(11, ROLE.MOD),
      dummyUser(12, ROLE.MOD),
      dummyUser(13, ROLE.MOD),
      dummyUser(14, ROLE.MOD),
      dummyUser(15, ROLE.MOD),
      dummyUser(16, ROLE.ADMIN),
      dummyUser(17, ROLE.ADMIN),
      dummyUser(18, ROLE.ADMIN),
    ]).then((data) => {
      logger.info('Seeding Complete')
      console.log(data)
      resolve(true)
    })
  })

const clearUsers = async () =>
  new Promise((resolve) => {
    UserModel.deleteMany({}).then(() => resolve(true))
  })

export const seedIfNotAlreadySeeded = async () => {
  const userList = await UserModel.findOne({ email: 'seed0@gmai.com' })
  console.log(userList)
  if (userList === null) {
    /** run seeding script */
    await seedUsers()
  }
}
