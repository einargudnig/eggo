import * as stylex from "@stylexjs/stylex";
import { HeadContent, Outlet, Scripts, createRootRoute, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { NotFound } from "../components/NotFound";
import { brand } from "../content/brand";
import { colors, fonts, motion, type } from "../design/tokens.stylex";
import { getDict, langFromParam } from "../i18n";
import appCss from "../styles/global.css?url";

const THEME_SCRIPT = `try{var t=localStorage.getItem("eggo-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/**
 * An unknown URL renders <NotFound /> under the root alone, so the page head (title, canonical, og) never runs.
 * Give it a title and keep it out of search.
 */
const notFoundMeta = (matches: readonly { routeId: string; params: { lang?: string } }[]) => {
  // The root head runs before /{-$lang}'s beforeLoad rejects /nope, so check the language here as well.
  const page = matches.find((m) => m.routeId === "/{-$lang}/");
  if (page && langFromParam(page.params.lang)) return [];
  const lang = matches.some((m) => m.params.lang === "en") ? "en" : "is";
  return [
    { title: `${getDict(lang).notFound.title} · ${brand.name}` },
    { name: "robots", content: "noindex" },
  ];
};

export const Route = createRootRoute({
  head: ({ matches }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      ...notFoundMeta(matches),
    ],
    links: [
      // The only face: fetch it alongside the CSS instead of after it (src/styles/fonts.css).
      {
        rel: "preload",
        href: "/fonts/public-sans-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

const styles = stylex.create({
  body: {
    backgroundColor: colors.page,
    color: colors.ink,
    fontFamily: fonts.text,
    fontSize: type.body,
    lineHeight: 1.55,
    transitionProperty: "background-color, color",
    transitionDuration: motion.base,
    transitionTimingFunction: motion.ease,
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
