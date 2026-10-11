/* oxlint-disable jsx-a11y/no-redundant-roles, jsx-a11y/no-interactive-element-to-noninteractive-role -- explicit table roles are deliberate: Safari drops table semantics once the phone layout sets display:block (ACCESSIBILITY.md #15) */
import * as stylex from "@stylexjs/stylex";
import { parts, type PartId } from "../content/parts";
import { troubleIds, troubles } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { SectionHead } from "./SectionHead";

type Props = { onShow: (id: PartId) => void };

/**
 * §3: symptom → fix → part. On phone the table is restyled as stacked rows; the explicit roles
 * keep table semantics there, since Safari drops them once `display` changes (ACCESSIBILITY.md #15).
 */
export function Troubleshooting({ onShow }: Props) {
  const { t } = useLang();
  const { open, close } = t.trouble.quote;
  return (
    <section
      id="bilanaleit"
      aria-labelledby="h-bilanaleit"
      tabIndex={-1}
      {...stylex.props(ui.anchor, styles.section)}
    >
      <SectionHead id="h-bilanaleit" index="§3" label={t.sections.bilanaleit} title={t.trouble.title} />
      <div {...stylex.props(styles.flush)}>
        <table role="table" {...stylex.props(styles.table)}>
          <thead role="rowgroup" {...stylex.props(styles.thead)}>
            <tr role="row">
              <th role="columnheader" {...stylex.props(styles.th, styles.first)}>
                <span {...stylex.props(ui.srOnly)}>{t.trouble.cols.item}</span>
                <span aria-hidden="true">#</span>
              </th>
              <th role="columnheader" {...stylex.props(styles.th)}>
                {t.trouble.cols.symptom}
              </th>
              <th role="columnheader" {...stylex.props(styles.th)}>
                {t.trouble.cols.fix}
              </th>
              <th role="columnheader" {...stylex.props(styles.th)}>
                {t.trouble.cols.part}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup" {...stylex.props(styles.block)}>
            {troubleIds.map((id) => {
              const part = troubles[id];
              const row = t.trouble.rows[id];
              return (
                <tr key={id} role="row" {...stylex.props(styles.tr)}>
                  <td role="cell" {...stylex.props(styles.td, styles.first, styles.item)}>
                    {id}
                  </td>
                  <td role="cell" {...stylex.props(styles.td, styles.symptom)}>
                    <span aria-hidden="true" {...stylex.props(styles.quote)}>
                      {open}
                    </span>
                    {row.symptom}
                    <span aria-hidden="true" {...stylex.props(styles.quote)}>
                      {close}
                    </span>
                  </td>
                  <td role="cell" {...stylex.props(styles.td, styles.fix)}>
                    {row.fix}
                  </td>
                  <td role="cell" {...stylex.props(styles.td, styles.goCell)}>
                    <button
                      type="button"
                      aria-label={`${t.trouble.see} ${part}, ${t.parts[part].short}`}
                      onClick={() => onShow(part)}
                      {...stylex.props(styles.goto, !parts[part].defined && styles.gotoUnknown, ui.focusRing)}
                    >
                      {`${part} · ${parts[part].code} →`}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  flush: {
    maxWidth: layout.max,
    marginInline: "auto",
    borderTopWidth: layout.rule,
    borderTopStyle: "solid",
    borderTopColor: colors.ruleStrong,
  },
  table: { width: "100%", borderCollapse: "collapse", display: { default: null, [media.phone]: "block" } },
  thead: { display: { default: null, [media.phone]: "none" } },
  block: { display: { default: null, [media.phone]: "block" } },
  tr: {
    display: { default: null, [media.phone]: "grid" },
    gridTemplateColumns: "minmax(0, 1fr) auto",
    columnGap: space.s3,
    rowGap: space.s2,
    alignItems: "center",
    paddingBlock: { default: null, [media.phone]: space.s4 },
    paddingInline: { default: null, [media.phone]: space.s4 },
    borderBottomWidth: { default: null, [media.phone]: layout.rule },
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
  th: {
    textAlign: "left",
    fontFamily: fonts.mono,
    fontSize: type.label,
    fontWeight: 500,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    color: colors.muted,
    paddingBlock: space.s3,
    paddingInlineEnd: space.s5,
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
    whiteSpace: "nowrap",
  },
  td: {
    display: { default: null, [media.phone]: "block" },
    paddingBlock: { default: space.s4, [media.phone]: 0 },
    paddingInlineEnd: { default: space.s5, [media.phone]: 0 },
    borderBottomWidth: { default: layout.rule, [media.phone]: 0 },
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
    verticalAlign: "top",
    fontSize: "16px",
  },
  first: { paddingInlineStart: space.s5, width: "3.5em" },
  item: { display: { default: null, [media.phone]: "none" }, fontFamily: fonts.mono, color: colors.muted },
  symptom: {
    gridColumn: "1 / -1",
    fontSize: { default: "19px", [media.phone]: "20px" },
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: 1.25,
  },
  quote: { color: colors.muted },
  fix: { gridColumn: 1, color: colors.muted, fontSize: { default: null, [media.phone]: type.small } },
  goCell: { gridColumn: 2 },
  goto: {
    fontFamily: fonts.mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: { default: colors.ink, ":active": colors.accent },
    paddingBlock: 0,
    paddingInline: space.s2,
    minHeight: { default: "32px", [media.phone]: "40px" },
    backgroundColor: {
      default: "transparent",
      ":active": colors.accent,
      [media.hover]: { default: null, ":hover": colors.accent },
    },
    color: {
      default: colors.ink,
      ":active": colors.onAccent,
      [media.hover]: { default: null, ":hover": colors.onAccent },
    },
    cursor: "pointer",
    whiteSpace: "nowrap",
    transitionProperty: "transform, background-color, color",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
    transform: { default: null, ":active": "translateY(1px)" },
  },
  gotoUnknown: { borderStyle: "dashed" },
});
