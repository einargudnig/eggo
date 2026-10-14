import * as stylex from "@stylexjs/stylex";
import { HeadContent, Outlet, Scripts, createRootRoute, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { media } from "../design/media.stylex";
import { colors, fonts, motion, type } from "../design/tokens.stylex";
import { langFromParam } from "../i18n";
import appCss from "../styles/global.css?url";

const THEME_SCRIPT = `try{var t=localStorage.getItem("eggo-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
    links: [
      // The hero headline and its labels: fetch them alongside the CSS instead of after it (src/styles/fonts.css).
      ...["schibsted-grotesk", "jetbrains-mono"].map((font) => ({
        rel: "preload",
        href: `/fonts/${font}-latin.woff2`,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      })),
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: RootComponent,
});

const styles = stylex.create({
  body: {
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: type.body,
    lineHeight: 1.5,
    // room for the phone thumb bar, so the back cover isn't hidden under it
    paddingBottom: { default: 0, [media.phone]: "calc(76px + env(safe-area-inset-bottom, 0px))" },
    transitionProperty: "background-color, color",
    transitionDuration: motion.base,
    transitionTimingFunction: motion.step,
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { lang } = useParams({ strict: false });
  return (
    <html lang={langFromParam(lang) ?? "is"} suppressHydrationWarning>
      <head>
        {/* oxlint-disable-next-line react/no-danger -- no-flash theme script must run before paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
        {import.meta.env.DEV ? <link rel="stylesheet" href="/virtual:stylex.css" /> : null}
      </head>
      <body {...stylex.props(styles.body)}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
