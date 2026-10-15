import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** How a project runs, drawn as one road with four stops. The last stop is blue: it's yours. */
export function Steps() {
  const { t } = useLang();
  return (
    <section
      id="ferli"
      aria-labelledby="h-steps"
      tabIndex={-1}
      {...stylex.props(ui.anchor, ui.section, ui.band)}
    >
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(styles.head)}>
          <h2 id="h-steps" {...stylex.props(ui.h2)}>
            {t.steps.title}
          </h2>
          <p {...stylex.props(styles.intro)}>{t.steps.intro}</p>
        </div>
        <div {...stylex.props(styles.track)}>
          <span aria-hidden="true" {...stylex.props(styles.asphalt)} />
          <ol {...stylex.props(styles.road)}>
            {t.steps.items.map((step, i) => (
              <li key={step.title} {...stylex.props(styles.stop)}>
                <span
                  aria-hidden="true"
                  {...stylex.props(styles.pin, i === t.steps.items.length - 1 && styles.pinEnd)}
                />
                <h3 {...stylex.props(styles.title)}>{step.title}</h3>
                <p {...stylex.props(styles.when)}>{step.when}</p>
                <p {...stylex.props(styles.body)}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const styles = stylex.create({
  head: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) minmax(0, 1.4fr)", [media.tablet]: "minmax(0, 1fr)" },
    gap: { default: space.s8, [media.tablet]: space.s3 },
    alignItems: "end",
    marginBottom: space.s7,
  },
  intro: { margin: 0, color: colors.muted, maxWidth: "34em" },
  track: { position: "relative" },
  /** The road behind the stops, with a dashed centre line painted in the band colour. */
  asphalt: {
    position: "absolute",
    left: { default: 0, [media.phone]: "13px" },
    right: { default: 0, [media.phone]: "auto" },
    top: { default: "13px", [media.phone]: 0 },
    bottom: { default: "auto", [media.phone]: 0 },
    width: { default: "auto", [media.phone]: "18px" },
    height: { default: "18px", [media.phone]: "auto" },
    backgroundColor: colors.ink,
    backgroundImage: {
      default: `repeating-linear-gradient(90deg, ${colors.page2} 0 22px, transparent 22px 44px)`,
      [media.phone]: `repeating-linear-gradient(180deg, ${colors.page2} 0 22px, transparent 22px 44px)`,
    },
    backgroundSize: { default: "100% 3px", [media.phone]: "3px 100%" },
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  road: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    position: "relative",
    display: "grid",
    gridTemplateColumns: { default: "repeat(4, minmax(0, 1fr))", [media.phone]: "minmax(0, 1fr)" },
    gap: { default: 0, [media.phone]: space.s6 },
  },
  stop: {
    position: "relative",
    display: { default: "block", [media.phone]: "grid" },
    gridTemplateColumns: "44px minmax(0, 1fr)",
    columnGap: space.s5,
    paddingRight: { default: space.s6, [media.phone]: 0 },
  },
  pin: {
    display: "block",
    gridRow: "1 / span 3",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: colors.page2,
    borderWidth: "6px",
    borderStyle: "solid",
    borderColor: colors.ink,
    position: "relative",
  },
  pinEnd: { backgroundColor: colors.sign, borderColor: colors.sign },
  title: {
    marginTop: { default: space.s5, [media.phone]: space.s2 },
    marginBottom: 0,
    fontFamily: fonts.sign,
    fontSize: type.h3,
    fontWeight: 800,
  },
  when: {
    marginTop: space.s2,
    marginBottom: 0,
    fontFamily: fonts.sign,
    fontWeight: 600,
    fontSize: type.fine,
    color: colors.muted,
  },
  body: {
    marginTop: space.s2,
    marginBottom: 0,
    fontSize: type.small,
    color: colors.muted,
    textWrap: "pretty",
  },
});
