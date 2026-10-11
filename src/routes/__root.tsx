import * as stylex from "@stylexjs/stylex";
import { HeadContent, Outlet, Scripts, createRootRoute, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { colors, fonts, motion, type } from "../design/tokens.stylex";
import { langFromParam } from "../i18n";
import appCss from "../styles/global.css?url";

const FONTS =
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Schibsted+Grotesk:wght@400;500;700;800;900&family=Reenie+Beanie&display=swap";

const THEME_SCRIPT = `try{var t=localStorage.getItem("eggo-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS },
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
