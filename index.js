var assert = require('nanoassert')
var wasm = require('./djb2.js')
var mod = wasm()

var size_t = 4
var head = size_t
var freeList = []

module.exports = Djb2
function Djb2 () {
  if (!(this instanceof Djb2)) return new Djb2()
  if (!mod.exports) throw new Error('WASM not loaded. Wait for Djb2.ready(cb)')

  if (!freeList.length) {
    freeList.push(head)
    head += size_t
  }

  this.pointer = freeList.pop()
  this.finalized = false

  mod.memory.fill(0, this.pointer, this.pointer + size_t)

  mod.exports.djb2_init(this.pointer)
}

Djb2.prototype.ready = Djb2.ready

Djb2.prototype.update = function (input) {
  assert(this.finalized === false, 'Hash instance finalized')
  assert(input, 'input must be TypedArray or Buffer')

  mod.memory.set(input, head)
  mod.exports.djb2_update(this.pointer, head, head + input.length)
  return this
}

Djb2.prototype.digest = function (enc) {
  assert(this.finalized === false, 'Hash instance finalized')
  this.finalized = true

  freeList.push(this.pointer)

  if (!enc || enc === 'binary') {
    return mod.memory.slice(this.pointer, this.pointer + size_t)
  }

  if (enc === 'hex') {
    return hexSlice(mod.memory, this.pointer, size_t)
  }

  assert(enc.length >= size_t, 'input must be TypedArray or Buffer')
  for (var i = 0; i < size_t; i++) {
    enc[i] = mod.memory[this.pointer + i]
  }

  return enc
}

Djb2.hash = function (input, enc) {
  var pointer = head
  mod.memory.set(input, head)
  return mod.exports.djb2(head, head + input.length)
}

Djb2.hash_xor = function (input, enc) {
  var pointer = head
  mod.memory.set(input, head)
  return mod.exports.djb2_xor(head, head + input.length)
}

// libsodium compat
Djb2.prototype.final = Djb2.prototype.digest

Djb2.ready = function (cb) {
  if (!cb) cb = noop
  if (!wasm.supported) return cb(new Error('WebAssembly not supported'))

  return mod.onload(cb)
}

function noop () {}

function hexSlice (buf, start, len) {
  var str = ''
  for (var i = 0; i < len; i++) str += toHex(buf[start + i])
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}
