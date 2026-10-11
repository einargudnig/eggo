import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../lib/useMediaQuery";
import { partDomId, partIds, parts, type PartId } from "../content/parts";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { MapFlow } from "./MapFlow";
import { PartDrawing } from "./PartDrawing";
import { SectionHead } from "./SectionHead";

type Props = { highlighted: PartId | null; onShow: (id: PartId) => void };

const PHONE_QUERY = "(max-width: 760px)";

export function Parts({ highlighted, onShow }: Props) {
  const { t } = useLang();
  const carousel = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState<PartId>("01");
  const isPhone = useMediaQuery(PHONE_QUERY);
  const current = highlighted ?? scrolled;

  useEffect(() => {
    const el = carousel.current;
    if (!el || !isPhone) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = [...el.children].filter((c) => c instanceof HTMLElement);
        const nearest = cards.reduce<HTMLElement | null>(
          (best, card) =>
            !best || Math.abs(card.offsetLeft - el.scrollLeft) < Math.abs(best.offsetLeft - el.scrollLeft)
              ? card
              : best,
          null,
        );
        const id = partIds.find((p) => partDomId(p) === nearest?.id);
        if (id) setScrolled(id);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isPhone]);

  return (
    <section id="smidi" aria-labelledby="h-smidi" tabIndex={-1} {...stylex.props(ui.anchor, styles.section)}>
      <SectionHead id="h-smidi" index="§1" label={t.partsSection.label} title={t.partsSection.title} />

      <nav aria-label={t.a11y.partsNav} {...stylex.props(styles.nav)}>
        {partIds.map((id) => (
          <button
            key={id}
            type="button"
            aria-controls={partDomId(id)}
            aria-current={current === id}
            aria-label={`${id} ${t.parts[id].short}`}
            onClick={() => onShow(id)}
            {...stylex.props(
              styles.tab,
              ui.focusRing,
              !parts[id].defined && styles.tabUnknown,
              current === id && (parts[id].defined ? styles.tabCurrent : styles.tabCurrentUnknown),
            )}
          >
            <span aria-hidden="true" {...stylex.props(styles.tabInner)}>
              {id}
              <small {...stylex.props(styles.tabCode)}>{parts[id].code}</small>
            </span>
          </button>
        ))}
      </nav>

      <section
        ref={carousel}
        aria-label={t.a11y.partsRegion}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region must be keyboard-reachable on phone (axe scrollable-region-focusable)
        tabIndex={isPhone ? 0 : undefined}
        {...stylex.props(styles.specs, ui.focusRing)}
      >
        {partIds.map((id) => (
          <SpecCard key={id} id={id} on={highlighted === id} />
        ))}
      </section>
      <div aria-hidden="true" {...stylex.props(styles.hint)}>
        <span {...stylex.props(ui.label)}>{t.partsSection.swipe}</span>
        <span {...stylex.props(ui.label, ui.tabular)}>{`${Number(current)} / ${partIds.length}`}</span>
      </div>
    </section>
  );
}

function SpecCard({ id, on }: { id: PartId; on: boolean }) {
  const { t } = useLang();
  const copy = t.parts[id];
  const unknown = !parts[id].defined;
  return (
    <article
      id={partDomId(id)}
      tabIndex={-1}
      {...stylex.props(styles.card, unknown && styles.cardUnknown, on && styles.cardOn)}
    >
      <div {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.top)}>
          <h3 {...stylex.props(styles.name)}>{copy.name}</h3>
          <div {...stylex.props(styles.id)}>
            <span {...stylex.props(styles.code, unknown && styles.codeUnknown, on && styles.codeOn)}>
              <span aria-hidden="true">{`${id} · ${parts[id].code}`}</span>
              <span {...stylex.props(ui.srOnly)}>{`${t.a11y.partWord} ${id}, ${copy.short}`}</span>
            </span>
            <PartDrawing id={id} on={on} />
          </div>
        </div>
        <p {...stylex.props(styles.lead)}>{copy.lead}</p>
        <dl {...stylex.props(styles.dl)}>
          {copy.specs.map((row) => (
            <div key={row.term} {...stylex.props(styles.row)}>
              <dt {...stylex.props(styles.dt)}>{row.term}</dt>
              <dd {...stylex.props(styles.dd, row.own && styles.own)}>
                {row.own ? (
                  <span aria-hidden="true" {...stylex.props(styles.ownMark)}>
                    ■{" "}
                  </span>
                ) : null}
                {row.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {unknown ? <MapFlow /> : null}
    </article>
  );
}

const hatch = `repeating-linear-gradient(-45deg, transparent 0 10px, ${colors.rule} 10px 11px)`;

const styles = stylex.create({
  section: {
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  nav: {
    display: { default: "none", [media.phone]: "grid" },
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    position: "sticky",
    top: layout.barHeight,
    zIndex: 20,
    backgroundColor: colors.surface,
    borderBlockWidth: layout.rule,
    borderBlockStyle: "solid",
    borderBlockColor: colors.ruleStrong,
  },
  tab: {
    minHeight: "48px",
    borderWidth: 0,
    borderRightWidth: { default: layout.rule, ":last-child": 0 },
    borderRightStyle: "solid",
    borderRightColor: colors.rule,
    backgroundColor: { default: "transparent", ":active": colors.surface2 },
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: "10.5px",
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: "0.04em",
    cursor: "pointer",
  },
  tabInner: { display: "grid", placeItems: "center", gap: 0 },
  tabCode: { fontSize: "9px", fontWeight: 500 },
  tabUnknown: {
    backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 6px, ${colors.rule} 6px 7px)`,
  },
  tabCurrent: {
    backgroundColor: colors.ink,
    color: colors.surface,
    outline: { default: null, [media.forcedColors]: "2px solid CanvasText" },
  },
  tabCurrentUnknown: { backgroundColor: colors.accent, backgroundImage: "none", color: colors.onAccent },
  specs: {
    position: "relative",
    maxWidth: layout.max,
    marginInline: "auto",
    display: { default: "grid", [media.phone]: "flex" },
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    borderTopWidth: { default: layout.rule, [media.phone]: 0 },
    borderTopStyle: "solid",
    borderTopColor: colors.ruleStrong,
    overflowX: { default: null, [media.phone]: "auto" },
    scrollSnapType: { default: null, [media.phone]: "x mandatory" },
    overscrollBehaviorX: "contain",
    alignItems: "flex-start",
    scrollbarWidth: "none",
    scrollPaddingInline: space.gutter,
    gap: { default: 0, [media.phone]: space.s3 },
    paddingInline: { default: 0, [media.phone]: space.gutter },
    paddingBlock: { default: 0, [media.phone]: space.s4 },
  },
  card: {
    // Positioned so visually-hidden labels inside stay clipped by the carousel instead of widening the page.
    position: "relative",
    display: "grid",
    gap: space.s5,
    alignContent: "start",
    paddingTop: { default: space.s6, [media.phone]: space.s5 },
    paddingInline: { default: space.s5, [media.phone]: space.s4 },
    paddingBottom: { default: space.s7, [media.phone]: space.s6 },
    borderWidth: { default: 0, [media.phone]: layout.rule },
    borderBottomWidth: layout.rule,
    borderRightWidth: { default: layout.rule, ":nth-child(even)": 0, [media.phone]: layout.rule },
    borderStyle: "solid",
    borderColor: colors.ruleStrong,
    backgroundColor: colors.surface,
    transitionProperty: "background-color",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
    scrollMarginTop: {
      default: `calc(${layout.barHeight} + ${space.s5})`,
      // phone: clear the sticky bar and the 48px part nav, so focus is never hidden (WCAG 2.4.11)
      [media.phone]: `calc(${layout.barHeight} + 48px + ${space.s4})`,
    },
    flexShrink: 0,
    flexBasis: { default: null, [media.phone]: `calc(100% - 20px)` },
    scrollSnapAlign: "start",
  },
  body: { display: "grid", gap: space.s5, alignContent: "start" },
  cardUnknown: {
    gridColumn: "1 / -1",
    gridTemplateColumns: { default: "minmax(0, 5fr) minmax(0, 7fr)", [media.tablet]: "1fr" },
    columnGap: space.s7,
    rowGap: space.s6,
    borderStyle: "dashed",
    borderWidth: layout.rule,
    backgroundImage: hatch,
  },
  cardOn: {
    backgroundColor: colors.surface2,
    outline: { default: null, [media.forcedColors]: "2px solid Highlight" },
  },
  top: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: space.s4 },
  name: { margin: 0, fontSize: type.h3, fontWeight: 800, letterSpacing: type.trackHead, lineHeight: 1 },
  id: { display: "grid", gap: space.s3, justifyItems: "end" },
  code: {
    fontFamily: fonts.mono,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.ink,
    paddingBlock: space.s1,
    paddingInline: space.s2,
    whiteSpace: "nowrap",
  },
  codeUnknown: { borderStyle: "dashed" },
  codeOn: { backgroundColor: colors.accent, borderColor: colors.accent, color: colors.onAccent },
  lead: { margin: 0, fontSize: type.body, maxWidth: "44ch", textWrap: "pretty" },
  dl: { margin: 0, borderTopWidth: layout.rule, borderTopStyle: "solid", borderTopColor: colors.rule },
  row: {
    display: "grid",
    gridTemplateColumns: { default: "9.5em minmax(0, 1fr)", [media.phone]: "7em minmax(0, 1fr)" },
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
  dt: {
    fontFamily: fonts.mono,
    fontSize: type.label,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    color: colors.muted,
    paddingTop: space.s3,
    paddingBottom: space.s2,
  },
  dd: { margin: 0, paddingBlock: space.s2, fontSize: "14px" },
  own: { fontWeight: 700 },
  ownMark: { color: colors.accentInk },
  hint: {
    display: { default: "none", [media.phone]: "flex" },
    justifyContent: "space-between",
    paddingInline: space.gutter,
    paddingBottom: space.s4,
  },
});
