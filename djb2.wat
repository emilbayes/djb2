(module
  ;; 0-64 reserved for param block
  (memory (export "memory") 10 1000)

  (func (export "djb2_init") (param $ptr i32)
    ;; setup param block (expect memory to be cleared)
    (i32.store (get_local $ptr) (i32.const 5381))
  )

  (func (export "djb2_update") (param $ptr i32) (param $input i32) (param $input_end i32)
    (local $hash i32)
    (set_local $hash (i32.load (get_local $ptr)))
    (block $end
      (loop $start
        (br_if $end (i32.eq (get_local $input) (get_local $input_end)))

        (set_local $hash
          (i32.add
            (get_local $hash)
            (i32.add
              (i32.load8_u (get_local $input))
              (i32.shl (get_local $hash) (i32.const 5))
            )
          )
        )

        (set_local $input (i32.add (get_local $input) (i32.const 1)))
        (br $start)
      )
    )

    (i32.store (get_local $ptr) (get_local $hash))
  )

  (func (export "djb2") (param $input i32) (param $input_end i32) (result i32)
    (local $hash i32)
    (set_local $hash (i32.const 5381))
    (block $end
      (loop $start
        (br_if $end (i32.eq (get_local $input) (get_local $input_end)))

        (set_local $hash
          (i32.add
            (get_local $hash)
            (i32.add
              (i32.load8_u (get_local $input))
              (i32.shl (get_local $hash) (i32.const 5))
            )
          )
        )

        (set_local $input (i32.add (get_local $input) (i32.const 1)))
        (br $start)
      )
    )

    (get_local $hash)
  )

  (func (export "djb2_xor") (param $input i32) (param $input_end i32) (result i32)
    (local $hash i32)
    (set_local $hash (i32.const 5381))
    (block $end
      (loop $start
        (br_if $end (i32.eq (get_local $input) (get_local $input_end)))

        (set_local $hash
          (i32.add
            (get_local $hash)
            (i32.xor
              (i32.load8_u (get_local $input))
              (i32.shl (get_local $hash) (i32.const 5))
            )
          )
        )

        (set_local $input (i32.add (get_local $input) (i32.const 1)))
        (br $start)
      )
    )

    (get_local $hash)
  )
)
