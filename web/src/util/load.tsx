import {
    DependencyList,
    useEffect,
    useRef,
    useState,
} from "react";
import { useHandler } from "./hook";

export interface LoadState<T> {
    error?: any;
    pending: boolean;
    value?: T;
}

export interface Loader<T> {
    (abort: AbortSignal): Promise<T>;
}

export function useLoad<T>(fn: Loader<T>, deps: DependencyList): LoadState<T> {
    const [state, setState] = useState<LoadState<T>>({ pending: false });

    useEffect(() => {
        const abortController = new AbortController();
        setState((state) => ({ ...state, pending: true }));
        fn(abortController.signal).then(
            (value) => setState({ pending: false, value }),
            (error) => {
                if (
                    error.code !== "ERR_CANCELED" ||
                    error.message !== "Another request is in flight"
                ) {
                    setState({ pending: false, error });
                }
            },
        );
        return () => {
            abortController.abort();
            setState((state) => ({ ...state, pending: false }));
        };
        // The way useLoad() is designed, we have no choice but to trust that the user gave us the correct deps for fn().
        // We could fix this by marking useLoad() as a custom hook, and then exhaustive-deps would enforce that for us.
        // https://www.npmjs.com/package/eslint-plugin-react-hooks#advanced-configuration
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return state;
}

export function useTriggerLoad<T>(
    fn: Loader<T>,
): [LoadState<T | undefined>, (signal?: AbortSignal) => void] {
    const [trigger, setTrigger] = useState<symbol | null>(null);

    const cleanup = useRef<() => void>(() => {});

    useEffect(() => {
        return () => cleanup.current();
    }, []);

    const triggerResolve = useRef<() => void>(() => {});
    const triggerFn = useHandler((signal?: AbortSignal) => {
        cleanup.current();
        setTrigger(Symbol());

        if (signal) {
            const stop = () => setTrigger(null);
            signal.addEventListener("abort", stop);
            cleanup.current = () => signal.removeEventListener("abort", stop);
        } else {
            cleanup.current = () => {};
        }
        return new Promise<void>((resolve) => {
            triggerResolve.current = resolve as any;
        });
    });

    const load = useLoad(
        async (abort) => {
            if (!trigger) {
                return Promise.resolve(undefined);
            }
            const resolve = triggerResolve.current;
            try {
                return await fn(abort);
            } finally {
                resolve();
            }
        },
        [trigger],
    );

    return [load, triggerFn];
}
