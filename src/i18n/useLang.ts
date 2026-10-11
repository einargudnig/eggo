import { useRouteContext } from "@tanstack/react-router";

/** Current language and dictionary. Only usable below the `/{-$lang}` route. */
export const useLang = () => useRouteContext({ from: "/{-$lang}" });
