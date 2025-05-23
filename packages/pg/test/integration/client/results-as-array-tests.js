'use strict'
const util = require('util')
const helper = require('./test-helper')
const assert = require('assert')
const suite = new helper.Suite()

const Client = helper.Client

const conInfo = helper.config

suite.test('returns results as array', function () {
  const client = new Client(conInfo)
  const checkRow = function (row) {
    assert(util.isArray(row), 'row should be an array')
    assert.equal(row.length, 4)
    assert.equal(row[0].getFullYear(), new Date().getFullYear())
    assert.strictEqual(row[1], 1)
    assert.strictEqual(row[2], 'hai')
    assert.strictEqual(row[3], null)
  }
  client.connect(
    assert.success(function () {
      const config = {
        text: 'SELECT NOW(), 1::int, $1::text, null',
        values: ['hai'],
        rowMode: 'array',
      }
      client.query(
        config,
        assert.success(function (result) {
          assert.equal(result.rows.length, 1)
          checkRow(result.rows[0])
          client.end()
        })
      )
    })
  )
})
