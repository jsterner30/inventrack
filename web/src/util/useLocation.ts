import { useMemo } from "react";

export function useLocationUrl (): URL {
    return useMemo(() => new URL(location.href), []);
}
