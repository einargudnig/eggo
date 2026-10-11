import { describe, it } from "node:test";
import { RuleTester } from "oxlint/plugins-dev";
import { rules } from "./eggo-plugin.ts";

RuleTester.describe = (name, fn) => void describe(name, fn);
RuleTester.it = (name, fn) => void it(name, fn);

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "tsx" } } });
const component = "src/components/Example.tsx";

tester.run("no-raw-design-values", rules["no-raw-design-values"], {
  valid: [
    {
      filename: component,
      code: `stylex.create({ a: { color: colors.ink, padding: space.s4, width: "72px" } })`,
    },
    {
      filename: component,
      code: `stylex.create({ a: { margin: 0, gap: { default: space.s2, "@media (x)": space.s3 } } })`,
    },
    { filename: "src/design/tokens.stylex.ts", code: `stylex.create({ a: { color: "#fff", padding: 16 } })` },
  ],
  invalid: [
    { filename: component, code: `stylex.create({ a: { color: "#E8501A" } })`, errors: 1 },
    {
      filename: component,
      code: `stylex.create({ a: { backgroundColor: { default: null, ":hover": "rgb(0 0 0)" } } })`,
      errors: 1,
    },
    { filename: component, code: `stylex.create({ a: { padding: 16, marginTop: "12px" } })`, errors: 2 },
    {
      filename: component,
      code: `stylex.create({ a: { gap: { default: space.s2, "@media (max-width: 760px)": "6px" } } })`,
      errors: 1,
    },
  ],
});

tester.run("no-literal-copy", rules["no-literal-copy"], {
  valid: [
    { filename: component, code: `const A = () => <p>{t.hero.lead}</p>;` },
    { filename: component, code: `const A = () => <span aria-hidden="true">→ · 01</span>;` },
    { filename: component, code: `const A = () => <button aria-label={t.a11y.darkMode} />;` },
  ],
  invalid: [
    { filename: component, code: `const A = () => <p>Hæ heimur</p>;`, errors: 1 },
    { filename: component, code: `const A = () => <button aria-label="Dark mode" />;`, errors: 1 },
    { filename: component, code: `const A = () => <input placeholder="Jón" />;`, errors: 1 },
  ],
});

tester.run("no-half-aria-patterns", rules["no-half-aria-patterns"], {
  valid: [{ filename: component, code: `const A = () => <button aria-current="true" />;` }],
  invalid: [
    { filename: component, code: `const A = () => <div role="tablist" />;`, errors: 1 },
    { filename: component, code: `const A = () => <button role="tab" />;`, errors: 1 },
  ],
});
