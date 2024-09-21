import { useCallback, useRef } from "react";
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * Returns function with stable reference for the passed callback.
 */
export function useHandler<F extends Function>(fn: F): F {
    const ref = useRef<F>(fn);

    ref.current = fn;

    return useCallback(
        (function (this: ThisType<F>, ...args: unknown[]) {
            return Reflect.apply(ref.current!, this, args);
        } as Function) as F,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
}
