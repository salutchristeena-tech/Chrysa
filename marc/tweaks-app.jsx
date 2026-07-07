/* MarC — Tweaks island. Applies aesthetic tokens to :root live. */
const { useEffect } = React;

const MARC_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": ["#6E7F73", "#5E6E63", "#46524A"],
  "theme": "light",
  "headline": "editorial",
  "density": "comfortable"
}/*EDITMODE-END*/;

const ACCENTS = [
  ["#6E7F73", "#5E6E63", "#46524A"], // eucalyptus
  ["#93A18E", "#7C8A78", "#5E6E63"], // sage
  ["#C9A85E", "#B0883A", "#8A6526"], // antique gold
  ["#8DA08C", "#6E7F73", "#54605A"], // celadon
  ["#A88A6A", "#8A6E50", "#6E573C"], // taupe
];

function MarcTweaks() {
  const [t, setTweak] = useTweaks(MARC_TWEAK_DEFAULTS);

  useEffect(() => {
    const root = document.documentElement;
    const [a, deep, ink] = Array.isArray(t.accent) ? t.accent : MARC_TWEAK_DEFAULTS.accent;
    root.style.setProperty("--accent", a);
    root.style.setProperty("--accent-deep", deep);
    root.style.setProperty("--accent-ink", ink);
    root.style.setProperty("--accent-soft", hexA(a, 0.12));
  }, [t.accent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme === "dark" ? "dark" : "light");
  }, [t.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-display",
      t.headline === "modern"
        ? '"Hanken Grotesk", system-ui, sans-serif'
        : '"Newsreader", Georgia, serif');
  }, [t.headline]);

  useEffect(() => {
    const map = { compact: "30px", comfortable: "40px", generous: "56px" };
    document.documentElement.style.setProperty("--gutter", map[t.density] || "40px");
  }, [t.density]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Identity" />
      <TweakColor label="Accent" value={t.accent} options={ACCENTS}
        onChange={(v) => setTweak("accent", v)} />
      <TweakRadio label="Headlines" value={t.headline}
        options={["editorial", "modern"]}
        onChange={(v) => setTweak("headline", v)} />
      <TweakSection label="Surface" />
      <TweakRadio label="Theme" value={t.theme}
        options={["light", "dark"]}
        onChange={(v) => setTweak("theme", v)} />
      <TweakRadio label="Density" value={t.density}
        options={["compact", "comfortable", "generous"]}
        onChange={(v) => setTweak("density", v)} />
    </TweaksPanel>
  );
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<MarcTweaks />);
