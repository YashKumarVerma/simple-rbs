/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
const axios = require('axios').default
const Faker = require('faker')

const localStorage = {
  cookie: undefined,
  url: 'http://localhost:3000',
  user: {
    firstName: 'angry',
    lastName: 'user',
    age: '20',
    email: 'angry_artillery@gmail.com',
    password: '12345',
    role: 'admin',
  },
}

function createAdminUser() {
  return new Promise(async (resolve) => {
    const newAdminUser = await axios.post(`${localStorage.url}/user`, localStorage.user)
    const { data } = newAdminUser
    try {
      const loginAttempt = await axios.post(`${localStorage.url}/auth/login`, {
        email: localStorage.user.email,
        password: localStorage.user.password,
      })
      const { token } = loginAttempt.data.payload
      console.log(`Logged in: token=${token}`)
      localStorage.cookie = token
    } catch (e) {
      process.exit(1)
    }

    resolve(true)
  })
}

// async function afterScenario(context, ee, next) {
//   try {
//     await axios.delete(`${localStorage.url}/user/${localStorage.user.email}`)
//     console.log(`Deleted user ${localStorage.user.email}`)
//   } catch (e) {
//     console.error('Error deleting user after scenario')
//   }

//   return next()
// }

/**
 * @todo : Refactor
 */
function getLoginAccess(userContext, events, done) {
  if (localStorage.cookie === undefined) {
    createAdminUser().then(() => {
      userContext.vars.token = localStorage.cookie
      return done()
    })
  } else {
    userContext.vars.token = localStorage.cookie
    return done()
  }

  return true
}

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  const firstName = Faker.name.firstName()
  const lastName = Faker.name.lastName()
  const email = Faker.internet.exampleEmail()
  const password = Faker.internet.password()

  // add variables to virtual user's context:
  userContext.vars.firstName = firstName
  userContext.vars.lastName = lastName
  userContext.vars.email = email
  userContext.vars.password = password
  userContext.vars.age = 20

  // continue with executing the scenario:
  return done()
}

module.exports = { getLoginAccess, generateRandomData }
