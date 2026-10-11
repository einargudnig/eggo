import { useSyncExternalStore } from "react";

const TICK_MS = 10_000;
const PLACEHOLDER = "--:--";

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, TICK_MS);
  return () => clearInterval(id);
};

/** Current HH:MM in a time zone. Renders a placeholder on the server so prerendered HTML never shows a stale time. */
export const useClock = (timeZone: string) => {
  const format = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });
  return useSyncExternalStore(
    subscribe,
    () => format.format(Date.now()),
    () => PLACEHOLDER,
  );
};
