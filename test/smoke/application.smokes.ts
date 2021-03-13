/* eslint-disable no-unused-expressions */

import { describe, it } from 'mocha'

import app from '../../src/app'
import chai from 'chai'
import chaiHttpHandler from 'chai-http'

chai.use(chaiHttpHandler)
const { expect } = chai

describe('application', () => {
  it('should listen on root for GET', () => {
    chai
      .request(app)
      .get('')
      .end((err, res) => {
        expect(err).not.to.be.undefined
        expect(res.body.alive).to.be.true
      })
  })
})
