import * as stylex from "@stylexjs/stylex";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState, type FormEvent } from "react";
import { brand } from "../content/brand";
import { partIds, type PartId } from "../content/parts";
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
  | { kind: "sent"; ticket: string; email: string };

export const fieldIds: Record<WorkOrderField, string> = {
  name: "o-name",
  email: "o-email",
  message: "o-msg",
};
const text = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

type Props = {
  /** Destinations, pre-ticked from the symptoms picked in the hero. */
  chosen: readonly PartId[];
  onToggle: (id: PartId) => void;
};

/** The work order: a short pitch on the left, the form on the right, on one quiet card. */
export function WorkOrder({ chosen, onToggle }: Props) {
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
      parts: [...chosen],
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
      setState({ kind: "sent", ticket, email: parsed.data.email });
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
      {...stylex.props(ui.anchor, ui.wrap, styles.section)}
    >
      <div {...stylex.props(ui.card)}>
        <div {...stylex.props(styles.grid)}>
          <div>
            <h2 id="h-contact" {...stylex.props(styles.title)}>
              {t.order.title}
            </h2>
            <p {...stylex.props(styles.body)}>{t.order.body}</p>
            <a href={`mailto:${brand.email}`} {...stylex.props(styles.mail, ui.focusRing)}>
              {brand.email}
            </a>
          </div>

          <div id="order" {...stylex.props(ui.anchor)}>
            {state.kind === "sent" ? (
              <div {...stylex.props(styles.receipt)}>
                <h3 ref={receiptTitle} tabIndex={-1} {...stylex.props(styles.receiptTitle)}>
                  {t.order.received}
                </h3>
                <p {...stylex.props(styles.ticket, ui.tabular)}>{state.ticket}</p>
                <p {...stylex.props(styles.body)}>
                  {t.order.receivedBody} {t.order.replyTo} <b>{state.email}</b>.
                </p>
                <Button type="button" onClick={reset}>
                  {t.order.again}
                </Button>
              </div>
            ) : (
              <form
                noValidate
                aria-label={t.order.form}
                onSubmit={(e) => void onSubmit(e)}
                {...stylex.props(styles.form)}
              >
                <div {...stylex.props(styles.pair)}>
                  <div {...stylex.props(styles.field)}>
                    <label htmlFor={fieldIds.name} {...stylex.props(styles.label)}>
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
                  <div {...stylex.props(styles.field)}>
                    <label htmlFor={fieldIds.email} {...stylex.props(styles.label)}>
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
                <fieldset {...stylex.props(styles.fieldset)}>
                  <legend {...stylex.props(styles.label, styles.legend)}>
                    {t.order.partsLegend} <span {...stylex.props(styles.optional)}>{t.order.optional}</span>
                  </legend>
                  <div {...stylex.props(styles.dests)}>
                    {partIds.map((id) => (
                      <label key={id} {...stylex.props(styles.dest)}>
                        <input
                          type="checkbox"
                          name="part"
                          value={id}
                          checked={chosen.includes(id)}
                          onChange={() => onToggle(id)}
                          {...stylex.props(styles.destInput, stylex.defaultMarker())}
                        />
                        <span {...stylex.props(styles.destLabel)}>{t.parts[id].sign}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div {...stylex.props(styles.field)}>
                  <label htmlFor={fieldIds.message} {...stylex.props(styles.label)}>
                    {t.order.message}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t.order.messagePlaceholder}
                    {...fieldProps("message")}
                    {...stylex.props(styles.input, styles.textarea, invalid("message") && styles.invalid)}
                  />
                </div>
                <div {...stylex.props(styles.foot)}>
                  <span id="o-err" role="alert" {...stylex.props(styles.error)}>
                    {state.kind === "editing" ? state.error : ""}
                  </span>
                  <Button type="submit" stretchOnPhone disabled={state.kind === "sending"}>
                    {state.kind === "sending" ? t.order.sending : t.order.submit}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: { paddingTop: 0, paddingBottom: space.s8 },
  grid: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 0.85fr) minmax(0, 1.15fr)", [media.tablet]: "minmax(0, 1fr)" },
    gap: { default: space.s8, [media.tablet]: space.s6 },
    paddingBlock: { default: space.s8, [media.phone]: space.s6 },
    paddingInline: { default: space.s8, [media.phone]: space.s5 },
  },
  title: {
    margin: 0,
    fontFamily: fonts.text,
    fontSize: type.h2,
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: type.trackHead,
    textWrap: "balance",
  },
  body: { marginTop: space.s4, marginBottom: 0, color: colors.muted, maxWidth: "26em", textWrap: "pretty" },
  mail: {
    display: "inline-block",
    marginTop: space.s5,
    fontWeight: 600,
    fontSize: type.lead,
    color: colors.accent,
  },
  form: { display: "grid", gap: space.s5 },
  pair: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) minmax(0, 1fr)", [media.phone]: "minmax(0, 1fr)" },
    gap: space.s5,
  },
  field: { display: "grid", gap: space.s2, minWidth: 0 },
  label: { fontWeight: 500, fontSize: type.small, lineHeight: 1.2 },
  input: {
    fontFamily: fonts.text,
    fontSize: "16px",
    lineHeight: 1.4,
    color: colors.ink,
    backgroundColor: colors.page,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.control,
    borderRadius: layout.control,
    paddingBlock: space.s3,
    paddingInline: space.s3,
    width: "100%",
    outline: { default: "none", ":focus-visible": `2px solid ${colors.accent}` },
    outlineOffset: "2px",
  },
  textarea: { minHeight: "112px", resize: "vertical" },
  invalid: { borderColor: colors.ink, borderWidth: "2px" },
  fieldset: { borderWidth: 0, margin: 0, padding: 0, minWidth: 0 },
  legend: { padding: 0 },
  optional: { fontWeight: 400, color: colors.muted },
  dests: { display: "flex", flexWrap: "wrap", gap: space.s2, marginTop: space.s2 },
  dest: { position: "relative", cursor: "pointer" },
  destInput: { position: "absolute", inset: 0, margin: 0, opacity: 0, cursor: "pointer" },
  destLabel: {
    display: "inline-block",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: { default: colors.control, [stylex.when.siblingBefore(":checked")]: colors.accent },
    borderRadius: "999px",
    paddingBlock: space.s2,
    paddingInline: space.s4,
    fontSize: type.small,
    fontWeight: 500,
    lineHeight: 1.2,
    backgroundColor: { default: colors.page, [stylex.when.siblingBefore(":checked")]: colors.accent },
    color: { default: colors.ink, [stylex.when.siblingBefore(":checked")]: colors.accentInk },
    // Forced colours drop the fill, so a ticked destination also gets underlined.
    textDecorationLine: {
      default: "none",
      [stylex.when.siblingBefore(":checked")]: { default: "none", [media.forcedColors]: "underline" },
    },
    outline: { default: "none", [stylex.when.siblingBefore(":focus-visible")]: `2px solid ${colors.accent}` },
    outlineOffset: "2px",
  },
  foot: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.s4,
  },
  error: { fontWeight: 600, fontSize: type.small },
  receipt: { display: "grid", gap: space.s4, justifyItems: "start" },
  receiptTitle: { margin: 0, fontSize: type.h3, fontWeight: 600 },
  ticket: { margin: 0, fontSize: "36px", fontWeight: 600, letterSpacing: type.trackDisplay },
});
