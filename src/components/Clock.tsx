import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { useClock } from "../lib/useClock";

/** Decoration: a changing time is noise to a screen reader (ACCESSIBILITY.md #14). */
export function Clock({ hideOnTablet = true }: { hideOnTablet?: boolean }) {
  const time = useClock(brand.timeZone);
  return (
    <span aria-hidden="true" {...stylex.props(ui.label, ui.tabular, hideOnTablet && styles.clock)}>
      {`${brand.city} ${time}`}
    </span>
  );
}

const styles = stylex.create({
  clock: { display: { default: null, [media.tablet]: "none" }, whiteSpace: "nowrap" },
});
