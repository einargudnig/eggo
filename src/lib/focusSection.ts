import type { SectionId } from "../content/sections";

/** Moves the viewport and focus together (ACCESSIBILITY.md rule 5). Sections carry tabIndex -1. */
export const focusSection = (id: SectionId) => {
  const el = document.getElementById(id);
  if (!el) return;
  const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
};
