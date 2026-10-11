const hex = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const mix = (fg, bg, a) => { const f = hex(fg), b = hex(bg); return "#" + f.map((v, i) => Math.round((v * a + b[i] * (1 - a)) * 255).toString(16).padStart(2, "0")).join(""); };
const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const themes = {
  light: { surface: "#F2F1EC", s2: "#E9E7E0", ink: "#111110", muted: "#5F5D57", accent: "#E8501A", onAccent: "#111110", accentInk: "#B83A0C", signal: "#E8D600", cbg: "#111110", cfg: "#F2F1EC" },
  dark: { surface: "#121211", s2: "#1B1B19", ink: "#E6E4DC", muted: "#9D9B93", accent: "#F2622B", onAccent: "#121211", accentInk: "#F47A4A", signal: "#CDBE12", cbg: "#1C1B18", cfg: "#E6E4DC" },
};
for (const [n, t] of Object.entries(themes)) {
  const cMuted = mix(t.cfg, t.cbg, 0.62);
  const pairs = [
    ["ink / surface", t.ink, t.surface, 4.5], ["muted / surface", t.muted, t.surface, 4.5], ["muted / surface-2", t.muted, t.s2, 4.5],
    ["accent-ink / surface (text)", t.accentInk, t.surface, 4.5], ["accent-ink / surface-2", t.accentInk, t.s2, 4.5],
    ["on-accent / accent (button)", t.onAccent, t.accent, 4.5], ["#111 / signal (tape)", "#111110", t.signal, 4.5],
    ["contact fg / bg", t.cfg, t.cbg, 4.5], ["contact muted / bg (labels)", cMuted, t.cbg, 4.5], ["accent / contact bg (error text)", t.accent, t.cbg, 4.5],
    ["rule-strong 55%/42% / surface (UI 3:1)", mix(t.ink, t.surface, n === "light" ? 0.55 : 0.42), t.surface, 3],
  ];
  console.log(`\n${n}`);
  for (const [name, a, b, min] of pairs) { const r = cr(a, b); console.log(`${r >= min ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(5)}  (min ${min})  ${name}`); }
}
