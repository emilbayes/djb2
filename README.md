# djb2 hash

> djb2 hash in WebAssembly and Javascript

## Benchmark

Interesting observation that djb2 hash is remarkably faster in WASM,
despite operating on 32-bit ints (like all bit ops in JS), and
despite having to copy data to WASM memory, while JS has direct
access:

```
5,000,000 wasm (add): 5463.410ms
b390d842
5,000,000 js (add): 27483.076ms
b390d842
5,000,000 wasm (xor): 5939.867ms
8c94c642
5,000,000 js (xor): 25120.488ms
8c94c642
```
