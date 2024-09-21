import { useCallback, useRef } from "react";


/**
 * Returns function with stable reference for the passed callback.
 */
export function useHandler<F extends Function>(fn: F): F {
    const ref = useRef<F>();
    ref.current = fn;
    return useCallback(
        // Cannot define args using Parameters<F> when F extends Function
        // https://github.com/microsoft/TypeScript/issues/31881
        (function (this: ThisType<F>, ...args: unknown[]) {
            return Reflect.apply(ref.current!, this, args);
        } as Function) as F,
            [],
            );
            }
