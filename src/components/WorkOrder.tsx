import * as stylex from "@stylexjs/stylex";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState, type FormEvent } from "react";
import { brand } from "../content/brand";
import { partIds, parts, type PartId } from "../content/parts";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { sendWorkOrder } from "../server/contact";
import { workOrderSchema, type WorkOrderField } from "../server/workOrder";
import { Button } from "./Button";

type State =
  | { kind: "editing"; invalid: readonly WorkOrderField[]; error: string }
  | { kind: "sending" }
  | { kind: "sent"; ticket: string };

const fieldIds: Record<WorkOrderField, string> = { name: "o-name", email: "o-email", message: "o-msg" };
const text = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

export function WorkOrder() {
  const { lang, t } = useLang();
  const send = useServerFn(sendWorkOrder);
  const [state, setState] = useState<State>({ kind: "editing", invalid: [], error: "" });
  const receiptTitle = useRef<HTMLHeadingElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const input = {
      name: text(form.get("name")),
      email: text(form.get("email")),
      message: text(form.get("message")),
      parts: form.getAll("part").map(text),
      lang,
    };
    const parsed = workOrderSchema.safeParse(input);
    if (!parsed.success) {
      const invalid = [...new Set(parsed.error.issues.map((i) => i.path[0]))].filter(
        (f): f is WorkOrderField => f === "name" || f === "email" || f === "message",
      );
      const empty = invalid.filter((f) => !input[f].trim());
      setState({ kind: "editing", invalid, error: empty.length ? t.order.errMissing : t.order.errEmail });
      const first = invalid[0];
      if (first) document.getElementById(fieldIds[first])?.focus();
      return;
    }
    setState({ kind: "sending" });
    try {
      const { ticket } = await send({ data: parsed.data });
      setState({ kind: "sent", ticket });
      requestAnimationFrame(() => receiptTitle.current?.focus());
    } catch {
      setState({ kind: "editing", invalid: [], error: t.order.errServer });
    }
  };

  const reset = () => {
    setState({ kind: "editing", invalid: [], error: "" });
    requestAnimationFrame(() => document.getElementById(fieldIds.name)?.focus());
  };

  const invalid = (f: WorkOrderField) => state.kind === "editing" && state.invalid.includes(f);
  const fieldProps = (f: WorkOrderField) => ({
    id: fieldIds[f],
    name: f,
    required: true,
    "aria-describedby": "o-err",
    "aria-invalid": invalid(f) || undefined,
  });

  return (
    <section
      id="samband"
      aria-labelledby="h-contact"
      tabIndex={-1}
      {...stylex.props(ui.anchor, styles.contact)}
    >
      <div {...stylex.props(ui.wrap, styles.grid)}>
        <h2 id="h-contact" {...stylex.props(styles.title)}>
          {t.order.title}
        </h2>
        <CopyEmail />
        <div id="order" {...stylex.props(ui.anchor, styles.order)}>
          <div {...stylex.props(styles.head)}>
            <span id="order-title" {...stylex.props(ui.label, styles.muted)}>
              {t.order.form}
            </span>
          </div>

          {state.kind === "sent" ? (
            <div {...stylex.props(styles.receipt)}>
              <h3 ref={receiptTitle} tabIndex={-1} {...stylex.props(ui.label, styles.muted)}>
                {t.order.received}
              </h3>
              <p {...stylex.props(styles.ticket)}>{state.ticket}</p>
              <p {...stylex.props(styles.receiptBody)}>{t.order.receivedBody}</p>
              <Button type="button" variant="ghost" inverted onClick={reset}>
                {t.order.again}
              </Button>
            </div>
          ) : (
            <form noValidate aria-labelledby="order-title" onSubmit={(e) => void onSubmit(e)}>
              <div {...stylex.props(styles.pair)}>
                <div {...stylex.props(styles.field)}>
                  <label htmlFor={fieldIds.name} {...stylex.props(ui.label, styles.muted)}>
                    {t.order.name}
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    placeholder={t.order.namePlaceholder}
                    {...fieldProps("name")}
                    {...stylex.props(styles.input, invalid("name") && styles.invalid)}
                  />
                </div>
                <div {...stylex.props(styles.field, styles.fieldSecond)}>
                  <label htmlFor={fieldIds.email} {...stylex.props(ui.label, styles.muted)}>
                    {t.order.email}
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    enterKeyHint="next"
                    placeholder={t.order.emailPlaceholder}
                    {...fieldProps("email")}
                    {...stylex.props(styles.input, invalid("email") && styles.invalid)}
                  />
                </div>
              </div>
              <fieldset {...stylex.props(styles.field, styles.fieldset)}>
                <legend {...stylex.props(ui.label, styles.muted, styles.legend)}>
                  {t.order.partsLegend}
                </legend>
                <div {...stylex.props(styles.chips)}>
                  {partIds.map((id) => (
                    <PartChip
                      key={id}
                      id={id}
                      label={parts[id].defined ? `${id} · ${parts[id].code}` : `${id} · ${t.order.notSure}`}
                      srLabel={`${id} ${t.parts[id].short}`}
                    />
                  ))}
                </div>
              </fieldset>
              <div {...stylex.props(styles.field)}>
                <label htmlFor={fieldIds.message} {...stylex.props(ui.label, styles.muted)}>
                  {t.order.message}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.order.messagePlaceholder}
                  {...fieldProps("message")}
                  {...stylex.props(styles.input, invalid("message") && styles.invalid)}
                />
              </div>
              <div {...stylex.props(styles.foot)}>
                <span id="o-err" role="alert" {...stylex.props(styles.error)}>
                  {state.kind === "editing" ? state.error : ""}
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  inverted
                  stretchOnPhone
                  disabled={state.kind === "sending"}
                >
                  {state.kind === "sending" ? t.order.sending : t.order.submit}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function CopyEmail() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brand.email);
      setCopied(true);
    } catch {
      // clipboard blocked: the address is still a mailto link and selectable
    }
  };
  return (
    <div {...stylex.props(styles.alt)}>
      <span {...stylex.props(ui.label, styles.muted)}>{t.order.orEmail}</span>
      <div {...stylex.props(styles.mailRow)}>
        <a href={`mailto:${brand.email}`} {...stylex.props(styles.mail, ui.focusRing)}>
          {brand.email}
        </a>
        <button
          type="button"
          onClick={() => void copy()}
          {...stylex.props(styles.copy, ui.focusRing, ui.press)}
        >
          {t.order.copy}
        </button>
        <output {...stylex.props(ui.srOnly)}>{copied ? t.order.copied : ""}</output>
      </div>
    </div>
  );
}

function PartChip({ id, label, srLabel }: { id: PartId; label: string; srLabel: string }) {
  const unknown = !parts[id].defined;
  return (
    <label {...stylex.props(styles.chip, unknown && styles.chipUnknown)}>
      <input type="checkbox" name="part" value={id} {...stylex.props(styles.chipInput)} />
      <span aria-hidden="true">{label}</span>
      <span {...stylex.props(ui.srOnly)}>{srLabel}</span>
    </label>
  );
}

const styles = stylex.create({
  contact: { backgroundColor: colors.contactBg, color: colors.contactFg },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    columnGap: space.gutter,
    rowGap: space.s6,
    paddingTop: { default: space.s8, [media.phone]: space.s7 },
    paddingBottom: { default: space.s9, [media.phone]: space.s7 },
  },
  title: {
    gridColumn: { default: "1 / 7", [media.tablet]: "1 / -1" },
    margin: 0,
    fontSize: { default: "clamp(40px, 5.6vw, 80px)", [media.phone]: "clamp(38px, 11vw, 56px)" },
    lineHeight: 0.95,
    letterSpacing: type.trackDisplay,
    fontWeight: 800,
    textWrap: "balance",
  },
  muted: { color: colors.contactMuted },
  alt: {
    gridColumn: { default: "1 / 7", [media.tablet]: "1 / -1" },
    display: "grid",
    gap: space.s3,
    alignContent: "start",
    justifyItems: "start",
  },
  mailRow: { position: "relative", display: "flex", alignItems: "center", flexWrap: "wrap", gap: space.s3 },
  mail: { fontFamily: fonts.mono, fontSize: "15px", fontWeight: 500, color: colors.contactFg },
  copy: {
    fontFamily: fonts.mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    minHeight: { default: "36px", [media.phone]: "44px" },
    paddingBlock: 0,
    paddingInline: space.s3,
    backgroundColor: { default: "transparent", [media.hover]: { default: null, ":hover": colors.contactFg } },
    color: { default: colors.contactFg, [media.hover]: { default: null, ":hover": colors.contactBg } },
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.contactRule,
    cursor: "pointer",
  },
  order: {
    gridColumn: { default: "7 / 13", [media.tablet]: "1 / -1" },
    gridRow: { default: "1 / span 2", [media.tablet]: "auto" },
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.contactRule,
    alignSelf: "start",
  },
  head: {
    paddingBlock: space.s3,
    paddingInline: space.s4,
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.contactRule,
  },
  pair: { display: "grid", gridTemplateColumns: { default: "1fr 1fr", [media.phone]: "1fr" } },
  field: {
    display: "grid",
    gap: space.s2,
    paddingBlock: space.s3,
    paddingInline: space.s4,
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.contactRule,
    backgroundColor: {
      default: null,
      ":focus-within": `color-mix(in srgb, ${colors.contactFg} 6%, ${colors.contactBg})`,
    },
  },
  fieldSecond: {
    borderLeftWidth: { default: layout.rule, [media.phone]: 0 },
    borderLeftStyle: "solid",
    borderLeftColor: colors.contactRule,
  },
  fieldset: { marginInline: 0, minWidth: 0, borderTopWidth: 0, borderInlineWidth: 0 },
  legend: { float: "left", width: "100%", marginBottom: space.s2 },
  input: {
    backgroundColor: "transparent",
    borderWidth: 0,
    color: colors.contactFg,
    fontFamily: fonts.display,
    fontSize: "16px",
    paddingBlock: space.s1,
    paddingInline: 0,
    width: "100%",
    resize: "vertical",
    outline: "none",
    "::placeholder": { color: colors.contactMuted, opacity: 0.7 },
  },
  invalid: { boxShadow: `inset 0 -2px 0 ${colors.accent}` },
  chips: {
    display: { default: "flex", [media.phone]: "grid" },
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    flexWrap: "wrap",
    gap: space.s2,
  },
  chip: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: { default: "36px", [media.phone]: "44px" },
    paddingInline: space.s3,
    fontFamily: fonts.mono,
    fontSize: type.label,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: { default: colors.contactRule, ":has(:checked)": colors.accent },
    backgroundColor: { default: "transparent", ":has(:checked)": colors.accent },
    color: { default: colors.contactMuted, ":has(:checked)": colors.onAccent },
    outline: {
      default: null,
      ":has(:focus-visible)": `2px solid ${colors.accent}`,
      [media.forcedColors]: { default: null, ":has(:checked)": "2px solid CanvasText" },
    },
    outlineOffset: "2px",
  },
  chipUnknown: { borderStyle: "dashed", gridColumn: "1 / -1" },
  chipInput: { position: "absolute", opacity: 0, inset: 0, margin: 0, cursor: "pointer" },
  foot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space.s3,
    paddingBlock: space.s3,
    paddingInline: space.s4,
  },
  error: { color: colors.accent, fontFamily: fonts.mono, fontSize: "12px", fontWeight: 500 },
  receipt: {
    display: "grid",
    gap: space.s3,
    paddingBlock: space.s5,
    paddingInline: space.s4,
    justifyItems: "start",
  },
  ticket: {
    margin: 0,
    fontSize: "36px",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.03em",
    fontVariantNumeric: "tabular-nums",
  },
  receiptBody: { margin: 0, color: colors.contactMuted, fontSize: type.small },
});
