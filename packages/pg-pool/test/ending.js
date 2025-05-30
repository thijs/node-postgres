'use strict'
const co = require('co')
const expect = require('expect.js')

const describe = require('mocha').describe
const it = require('mocha').it

const Pool = require('../')

describe('pool ending', () => {
  it('ends without being used', (done) => {
    const pool = new Pool()
    pool.end(done)
  })

  it('ends with a promise', () => {
    return new Pool().end()
  })

  it(
    'ends with clients',
    co.wrap(function* () {
      const pool = new Pool()
      const res = yield pool.query('SELECT $1::text as name', ['brianc'])
      expect(res.rows[0].name).to.equal('brianc')
      return pool.end()
    })
  )

  it(
    'allows client to finish',
    co.wrap(function* () {
      const pool = new Pool()
      const query = pool.query('SELECT $1::text as name', ['brianc'])
      yield pool.end()
      const res = yield query
      expect(res.rows[0].name).to.equal('brianc')
    })
  )

  it('pool.end() - finish pending queries', async () => {
    const pool = new Pool({ max: 20 })
    let completed = 0
    for (let x = 1; x <= 20; x++) {
      pool.query('SELECT $1::text as name', ['brianc']).then(() => completed++)
    }
    await pool.end()
    expect(completed).to.equal(20)
  })
})
