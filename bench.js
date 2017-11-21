var djb2wasm = require('./index')

function djb2js (input) {
  var hash = 5381

  for (var i = 0; i < input.length; i++) {
    hash = hash + ((hash << 5) + input[i] | 0) | 0;
  }

  return hash
}

function djb2js_xor (input) {
  var hash = 5381

  for (var i = 0; i < input.length; i++) {
    hash = hash + ((hash << 5) ^ input[i]) | 0;
  }

  return hash
}

djb2wasm.ready(function (err) {
  if (err) throw err

  var input = Buffer.from('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi eaque, labore qui nihil, id vel, quasi ipsum, laboriosam modi deleniti rem placeat et. Ipsum id, aliquam explicabo ullam fuga, nostrum! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit iusto aperiam rem ut, repellendus quia cumque, autem rerum officiis accusantium laborum vero recusandae, alias ea ipsum atque obcaecati officia eveniet! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores necessitatibus deleniti expedita quo ipsam nemo magni ut doloremque voluptate voluptates, praesentium dolor, libero deserunt beatae rem velit eaque et illum?')
  console.time('wasm (add)')
  for (var i = 0; i < 5e6; i++) {
    djb2wasm.hash(input)
  }
  console.timeEnd('wasm (add)')


  console.log((djb2wasm.hash(input) >>> 0).toString(16))

  console.time('js (add)')
  for (var i = 0; i < 5e6; i++) {
    djb2js(input)
  }
  console.timeEnd('js (add)')

  console.log((djb2js(input) >>> 0).toString(16))


  console.time('wasm (xor)')
  for (var i = 0; i < 5e6; i++) {
    djb2wasm.hash_xor(input)
  }
  console.timeEnd('wasm (xor)')


  console.log((djb2wasm.hash_xor(input) >>> 0).toString(16))

  console.time('js (xor)')
  for (var i = 0; i < 5e6; i++) {
    djb2js_xor(input)
  }
  console.timeEnd('js (xor)')

  console.log((djb2js_xor(input) >>> 0).toString(16))
})
