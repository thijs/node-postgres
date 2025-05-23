'use strict'

const BufferList = function () {
  this.buffers = []
}
const p = BufferList.prototype

p.add = function (buffer, front) {
  this.buffers[front ? 'unshift' : 'push'](buffer)
  return this
}

p.addInt16 = function (val, front) {
  return this.add(Buffer.from([val >>> 8, val >>> 0]), front)
}

p.getByteLength = function () {
  return this.buffers.reduce(function (previous, current) {
    return previous + current.length
  }, 0)
}

p.addInt32 = function (val, first) {
  return this.add(
    Buffer.from([(val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, (val >>> 0) & 0xff]),
    first
  )
}

p.addCString = function (val, front) {
  const len = Buffer.byteLength(val)
  const buffer = Buffer.alloc(len + 1)
  buffer.write(val)
  buffer[len] = 0
  return this.add(buffer, front)
}

p.addString = function (val, front) {
  const len = Buffer.byteLength(val)
  const buffer = Buffer.alloc(len)
  buffer.write(val)
  return this.add(buffer, front)
}

p.addChar = function (char, first) {
  return this.add(Buffer.from(char, 'utf8'), first)
}

p.join = function (appendLength, char) {
  let length = this.getByteLength()
  if (appendLength) {
    this.addInt32(length + 4, true)
    return this.join(false, char)
  }
  if (char) {
    this.addChar(char, true)
    length++
  }
  const result = Buffer.alloc(length)
  let index = 0
  this.buffers.forEach(function (buffer) {
    buffer.copy(result, index, 0)
    index += buffer.length
  })
  return result
}

module.exports = BufferList
