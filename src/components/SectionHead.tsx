import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { ui } from "../design/primitives";

type Props = { headingId: string; title: string; children?: ReactNode };

/** The section heading, then one muted sentence. */
export function SectionHead({ headingId, title, children }: Props) {
  return (
    <div {...stylex.props(ui.head)}>
      <h2 id={headingId} {...stylex.props(ui.h2)}>
        {title}
      </h2>
      {children ? <p {...stylex.props(ui.headBody)}>{children}</p> : null}
    </div>
  );
}
