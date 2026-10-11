import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { space, type } from "../design/tokens.stylex";

type Props = { id: string; index: string; label: string; title: string; aside?: string };

export function SectionHead({ id, index, label, title, aside }: Props) {
  return (
    <div {...stylex.props(ui.wrap, styles.head)}>
      <span {...stylex.props(ui.label, styles.label)}>
        <b {...stylex.props(ui.labelStrong)}>{index}</b> {label}
      </span>
      <h2 id={id} {...stylex.props(styles.title)}>
        {title}
      </h2>
      {aside ? <span {...stylex.props(ui.label, styles.aside)}>{aside}</span> : null}
    </div>
  );
}

const styles = stylex.create({
  head: {
    display: "grid",
    gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    columnGap: space.gutter,
    rowGap: space.s3,
    paddingTop: { default: space.s6, [media.phone]: space.s5 },
    paddingBottom: { default: space.s7, [media.phone]: space.s5 },
    alignItems: "baseline",
  },
  label: { gridColumn: { default: "1 / 4", [media.tablet]: "1 / -1" } },
  title: {
    gridColumn: { default: "4 / 11", [media.tablet]: "1 / -1" },
    margin: 0,
    fontWeight: 800,
    fontSize: type.h2,
    lineHeight: 1,
    letterSpacing: type.trackHead,
    textWrap: "balance",
  },
  aside: {
    gridColumn: { default: "11 / 13", [media.tablet]: "1 / -1" },
    justifySelf: { default: "end", [media.tablet]: "start" },
    textAlign: { default: "right", [media.tablet]: "left" },
  },
});
