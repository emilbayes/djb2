# djb2 hash

> djb2 hash in WebAssembly and Javascript

## Benchmark

~~Interesting observation that djb2 hash is remarkably faster in WASM,
despite operating on 32-bit ints (like all bit ops in JS) equal performance, and
despite having to copy data to WASM memory, while JS has direct
access:~~

**Edit**: Less interesting now, the issue was coercing additions to 32-bit
operations. Thank you to @mraleph for teaching me this lesson:

```
wasm (add): 5573.926ms
b390d842
js (add): 5220.253ms
b390d842
wasm (xor): 4876.401ms
8c94c642
js (xor): 4450.471ms
8c94c642
```
