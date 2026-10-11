import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, type MouseEvent } from "react";
import { partIds } from "../content/parts";
import { sectionIds, type SectionId } from "../content/sections";
import { caseIds, troubleIds } from "../content/work";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";
import type { Dict } from "../i18n/is";
import { useLang } from "../i18n/useLang";
import { focusSection } from "../lib/focusSection";
import { Clock } from "./Clock";
import { LangLink } from "./LangLink";
import { ThemeSwitch } from "./ThemeSwitch";

type Props = { open: boolean; onClose: () => void };

const range = (xs: readonly (string | number)[]) => `${xs[0]}–${xs.at(-1)}`;

/** The right-hand "page number" column of the table of contents. */
const pageRef: Record<SectionId, (t: Dict) => string> = {
  smidi: () => range(partIds),
  verk: () => `(${caseIds.length})`,
  bilanaleit: () => range(troubleIds),
  ferli: (t) => range(t.steps.items.map((_, i) => i + 1)),
  hver: () => "1",
  samband: (t) => t.contents.workOrderShort,
};

/**
 * Phone table of contents. A native modal <dialog> traps focus and returns it to the
 * Efni button on close; picking an entry moves focus to that section (ACCESSIBILITY.md #6).
 */
export function ContentsSheet({ open, onClose }: Props) {
  const { t } = useLang();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    e.preventDefault();
    dialog.current?.close();
    focusSection(id);
  };

  return (
    <dialog
      ref={dialog}
      id="contents"
      aria-labelledby="contents-title"
      onClose={onClose}
      {...stylex.props(styles.dialog)}
    >
      <div {...stylex.props(styles.sheet)}>
        <div {...stylex.props(styles.top)}>
          <span {...stylex.props(ui.label)}>
            <b id="contents-title" {...stylex.props(ui.labelStrong)}>
              {t.contents.title}
            </b>
            {" · "}
            <Clock hideOnTablet={false} />
          </span>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
            {...stylex.props(styles.close, ui.focusRing, ui.press)}
          >
            {t.contents.close}
          </button>
        </div>
        <ol {...stylex.props(styles.toc)}>
          {sectionIds.map((id, i) => (
            <li key={id} {...stylex.props(styles.item)}>
              <a href={`#${id}`} onClick={(e) => go(e, id)} {...stylex.props(styles.link, ui.focusRing)}>
                <span aria-hidden="true" {...stylex.props(styles.ref)}>
                  {id === "samband" ? "→" : `§${i + 1}`}
                </span>
                <span {...stylex.props(styles.title)}>{t.sections[id]}</span>
                <span aria-hidden="true" {...stylex.props(styles.leader)} />
                <span {...stylex.props(ui.srOnly)}>, </span>
                <span {...stylex.props(styles.ref)}>{pageRef[id](t)}</span>
              </a>
            </li>
          ))}
        </ol>
        <div {...stylex.props(styles.foot)}>
          <LangLink large />
          <ThemeSwitch />
        </div>
      </div>
    </dialog>
  );
}

const sheetIn = stylex.keyframes({ from: { transform: "translateY(16px)", opacity: 0 } });

const styles = stylex.create({
  dialog: {
    borderWidth: 0,
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100%",
    maxWidth: "none",
    maxHeight: "none",
    backgroundColor: colors.surface,
    color: colors.ink,
  },
  sheet: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    animationName: sheetIn,
    animationDuration: motion.slow,
    animationTimingFunction: motion.step,
  },
  top: {
    flex: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "content-box",
    height: layout.barHeight,
    paddingTop: "env(safe-area-inset-top, 0px)",
    paddingInline: space.gutter,
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  close: {
    height: "40px",
    paddingBlock: 0,
    paddingInline: space.s3,
    fontFamily: fonts.mono,
    fontSize: type.label,
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    backgroundColor: "transparent",
    color: colors.ink,
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.ink,
    cursor: "pointer",
  },
  toc: {
    flex: 1,
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
    paddingBlock: space.s2,
    paddingInline: space.gutter,
  },
  item: { borderBottomWidth: layout.rule, borderBottomStyle: "solid", borderBottomColor: colors.rule },
  link: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "2.6em minmax(0, auto) 1fr auto",
    alignItems: "baseline",
    gap: space.s3,
    paddingBlock: space.s5,
    color: { default: colors.ink, ":active": colors.accentInk },
    textDecoration: "none",
  },
  ref: { fontFamily: fonts.mono, fontSize: "12px", fontWeight: 500, color: colors.muted },
  title: { fontSize: "30px", fontWeight: 800, letterSpacing: type.trackHead, lineHeight: 1 },
  leader: {
    borderBottomWidth: layout.rule,
    borderBottomStyle: "dotted",
    borderBottomColor: colors.ruleStrong,
    transform: "translateY(-5px)",
  },
  foot: {
    flex: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space.s4,
    paddingTop: space.s4,
    paddingInline: space.gutter,
    paddingBottom: `calc(${space.s4} + env(safe-area-inset-bottom, 0px))`,
    borderTopWidth: layout.rule,
    borderTopStyle: "solid",
    borderTopColor: colors.ruleStrong,
  },
});
