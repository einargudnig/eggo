import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { colors } from "../design/tokens.stylex";
import { wordmark } from "../design/wordmark";

/** The drawn "eggó". Decorative: the link around it carries the name. Letters take the text colour. */
export function Wordmark({ style }: { style?: stylex.StyleXStyles }) {
  return (
    <svg
      viewBox={`0 0 ${wordmark.width} ${wordmark.height}`}
      aria-hidden="true"
      {...stylex.props(styles.svg, style)}
    >
      {wordmark.letters.map((d) => (
        <path key={d} d={d} {...stylex.props(styles.ink)} />
      ))}
      <polygon points={wordmark.accent} {...stylex.props(styles.accent)} />
    </svg>
  );
}

const styles = stylex.create({
  svg: { display: "block", width: "auto", overflow: "visible" },
  ink: { fill: "currentColor" },
  accent: { fill: { default: colors.accent, [media.forcedColors]: "currentColor" } },
});
