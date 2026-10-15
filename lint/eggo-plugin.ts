/**
 * Eggó house rules, run by Oxlint as a JS plugin (`.oxlintrc.json` → jsPlugins).
 * Each rule enforces a decision from docs/DESIGN-SYSTEM.md or docs/ACCESSIBILITY.md;
 * the message says which, so an agent can fix the cause instead of silencing the rule.
 * Tests: lint/eggo-plugin.test.ts (`bun run test`).
 */
import type { RuleTester } from "oxlint/plugins-dev";

/** Oxlint doesn't export its rule types by name; derive them so visitors get typed AST nodes. */
type Rule = Extract<Parameters<RuleTester["run"]>[1], { create: unknown }>;
type Visitor = ReturnType<Rule["create"]>;
type NodeOf<K extends keyof Visitor> = Parameters<NonNullable<Visitor[K]>>[0];
type Context = Parameters<Rule["create"]>[0];
type CallExpression = NodeOf<"CallExpression">;
type StyleNode = CallExpression["arguments"][number];

const DESIGN_DIR = /[\\/]src[\\/]design[\\/]/;
const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\(/i;
const SPACING_PROP = /^(?:padding|margin|gap|rowGap|columnGap|inset)/;
const RAW_PX = /^-?\d*\.?\d+px$/;

const isStylexCreate = ({ callee }: CallExpression) =>
  callee.type === "MemberExpression" &&
  callee.object.type === "Identifier" &&
  callee.object.name === "stylex" &&
  callee.property.type === "Identifier" &&
  callee.property.name === "create";

/** Walks a stylex.create() argument: raw colours are banned everywhere, raw lengths on spacing props. */
const checkStyleValue = (context: Context, node: StyleNode, prop: string | undefined): void => {
  if (node.type === "ObjectExpression") {
    for (const p of node.properties) {
      if (p.type !== "Property") continue;
      const key =
        p.key.type === "Identifier" ? p.key.name : p.key.type === "Literal" ? String(p.key.value) : undefined;
      const isCondition = key === undefined || key === "default" || /^[:@[]/.test(key);
      checkStyleValue(context, p.value, isCondition ? prop : key);
    }
    return;
  }
  if (node.type === "Literal") {
    const { value } = node;
    if (typeof value === "string" && RAW_COLOR.test(value)) {
      context.report({
        node,
        message:
          "Raw colour. Use a token from src/design/tokens.stylex.ts (`colors.*`). Add a token there if none fits (DESIGN-SYSTEM §3).",
      });
    }
    const rawSpacing =
      (typeof value === "number" && value !== 0) || (typeof value === "string" && RAW_PX.test(value));
    if (prop && SPACING_PROP.test(prop) && rawSpacing) {
      context.report({
        node,
        message: `Raw spacing on \`${prop}\`. Use \`space.*\` from src/design/tokens.stylex.ts (scale 2·4·8·12·16·24·32·48·64·96·144, DESIGN-SYSTEM §4).`,
      });
    }
    return;
  }
  if (node.type === "TemplateLiteral" && node.quasis.some((q) => RAW_COLOR.test(q.value.raw))) {
    context.report({ node, message: "Raw colour in template. Use `colors.*` tokens." });
  }
};

const noRawDesignValues: Rule = {
  meta: { type: "problem", docs: { description: "Colours and spacing must come from design tokens." } },
  create: (context) => {
    if (DESIGN_DIR.test(context.filename)) return {};
    return {
      CallExpression: (node) => {
        const [arg] = node.arguments;
        if (arg && isStylexCreate(node)) checkStyleValue(context, arg, undefined);
      },
    };
  },
};

const LABEL_ATTRS = new Set([
  "aria-label",
  "aria-description",
  "aria-roledescription",
  "title",
  "alt",
  "placeholder",
]);
const hasLetters = (s: string) => /\p{L}/u.test(s);
const attrName = (node: NodeOf<"JSXAttribute">) =>
  node.name.type === "JSXIdentifier" ? node.name.name : undefined;
const attrString = (node: NodeOf<"JSXAttribute">) =>
  node.value?.type === "Literal" && typeof node.value.value === "string" ? node.value.value : undefined;

const noLiteralCopy: Rule = {
  meta: { type: "problem", docs: { description: "User-facing text comes from the dictionaries." } },
  create: (context) => ({
    JSXText: (node) => {
      const value = node.value.trim();
      if (value && hasLetters(value)) {
        context.report({
          node,
          message: `Literal copy "${value.slice(0, 40)}". Put it in src/i18n/is.ts (and en.ts) and read it from \`useLang().t\`. Proper nouns go in src/content/brand.ts.`,
        });
      }
    },
    JSXAttribute: (node) => {
      const name = attrName(node);
      const value = attrString(node);
      if (name && LABEL_ATTRS.has(name) && value && hasLetters(value)) {
        context.report({
          node,
          message: `Literal \`${name}\`. Screen-reader and visible text must come from the dictionary so it follows the language (ACCESSIBILITY.md rule 1).`,
        });
      }
    },
  }),
};

const BANNED_ROLES = new Set(["tab", "tablist", "tabpanel", "menu", "menubar", "menuitem"]);

const noHalfAriaPatterns: Rule = {
  meta: { type: "problem", docs: { description: "Composite ARIA widgets need full keyboard contracts." } },
  create: (context) => ({
    JSXAttribute: (node) => {
      const role = attrName(node) === "role" ? attrString(node) : undefined;
      if (role && BANNED_ROLES.has(role)) {
        context.report({
          node,
          message: `role="${role}" promises arrow-key and panel behaviour. Use buttons with aria-current/aria-pressed, or a React Aria component (ACCESSIBILITY.md rule 2).`,
        });
      }
    },
  }),
};

export const rules = {
  "no-raw-design-values": noRawDesignValues,
  "no-literal-copy": noLiteralCopy,
  "no-half-aria-patterns": noHalfAriaPatterns,
};

export default { meta: { name: "eggo" }, rules };
