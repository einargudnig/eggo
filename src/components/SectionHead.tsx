import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { sectionIds, type SectionId } from "../content/sections";
import { ui } from "../design/primitives";
import { useLang } from "../i18n/useLang";

type Props = { section: SectionId; headingId: string; title: string; children?: ReactNode };

/** "§2 · Lítil verk" above the heading, then one muted sentence. The number comes from the section's place in the page. */
export function SectionHead({ section, headingId, title, children }: Props) {
  const { t } = useLang();
  return (
    <div {...stylex.props(ui.head)}>
      <p aria-hidden="true" {...stylex.props(ui.label)}>
        <b {...stylex.props(ui.labelStrong)}>{`§${sectionIds.indexOf(section) + 1}`}</b>
        {` · ${t.sections[section]}`}
      </p>
      <h2 id={headingId} {...stylex.props(ui.h2)}>
        {title}
      </h2>
      {children ? <p {...stylex.props(ui.headBody)}>{children}</p> : null}
    </div>
  );
}
