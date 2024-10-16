import { useCallback, useRef } from 'react'

/**
 * Returns function with stable reference for the passed callback.
 */
export function useHandler<F extends Function> (fn: F): F {
  const ref = useRef<F>(fn)

  ref.current = fn

  return useCallback(
    (function (this: ThisType<F>, ...args: unknown[]) {
      return Reflect.apply(ref.current, this, args)
    } as Function) as F,
    []
  )
}
