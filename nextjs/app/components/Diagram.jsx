"use client";

import { useEffect, useId, useRef, useState } from "react";
import { palette } from "../../lib/palette.mjs";

// A ```mermaid block in any page (and the preview on /diagram), drawn in the browser with clean, straight lines, thin
// strokes, and the note colors. Dark on the site; light inside /print. When the source has a mistake, the error and the
// source are shown instead, so a half-finished diagram in a note is still readable.

let loaded;
function loadMermaid() {
  loaded ||= import("mermaid").then((module) => module.default);
  return loaded;
}

function config(theme) {
  const c = palette[theme];
  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    look: "classic",
    fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
    flowchart: { curve: "linear", padding: 14, nodeSpacing: 46, rankSpacing: 52, htmlLabels: true },
    mindmap: { padding: 14 },
    themeVariables: {
      fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
      fontSize: "15px",
      darkMode: theme === "dark",
      background: "transparent",
      primaryColor: c.wash,
      primaryTextColor: c.ink,
      primaryBorderColor: c.c2,
      secondaryColor: c.wash,
      secondaryTextColor: c.ink,
      secondaryBorderColor: c.c1,
      tertiaryColor: c.wash,
      tertiaryTextColor: c.ink,
      tertiaryBorderColor: c.c3,
      mainBkg: c.wash,
      nodeBorder: c.c2,
      nodeTextColor: c.ink,
      lineColor: c.line,
      textColor: c.ink,
      titleColor: c.ink,
      edgeLabelBackground: c.paper,
      clusterBkg: "transparent",
      clusterBorder: c.muted,
      noteBkgColor: c.wash,
      noteTextColor: c.ink,
      noteBorderColor: c.c1,
      actorBkg: c.wash,
      actorBorder: c.c2,
      actorTextColor: c.ink,
      actorLineColor: c.muted,
      signalColor: c.ink,
      signalTextColor: c.ink,
      labelBoxBkgColor: c.wash,
      labelBoxBorderColor: c.c1,
      labelTextColor: c.ink,
      sequenceNumberColor: c.paper,
      // Mind maps, timelines, and journeys color their branches from this scale, in the note-color order.
      ...Object.fromEntries([c.c1, c.c2, c.c3, c.c4].flatMap((color, index) => [
        [`cScale${index}`, color], [`cScale${index + 4}`, color], [`cScale${index + 8}`, color],
      ])),
      ...Object.fromEntries(Array.from({ length: 12 }, (_, index) => [`cScaleLabel${index}`, c.paper])),
      git0: c.c1, git1: c.c2, git2: c.c3, git3: c.c4,
    },
  };
}

// Flowcharts can use the note colors by name: A:::c1 (amber), A:::c2 (teal), A:::c3 (violet), A:::c4 (rose), plus
// A:::muted for something set aside. Defined here so a note doesn't have to.
export function withNoteClasses(source, theme) {
  const first = source.split("\n").find((line) => line.trim() && !line.trim().startsWith("%%") && line.trim() !== "---");
  if (!/^\s*(?:flowchart|graph)\b/i.test(first || "")) return source;
  const c = palette[theme];
  const defs = ["c1", "c2", "c3", "c4"]
    .filter((name) => !new RegExp(`classDef\\s+${name}\\b`).test(source))
    .map((name) => `classDef ${name} stroke:${c[name]},stroke-width:2px,color:${c.ink},fill:${theme === "dark" ? `${c[name]}1f` : `${c[name]}14`}`);
  if (!/classDef\s+muted\b/.test(source)) defs.push(`classDef muted stroke:${c.muted},stroke-dasharray:4 3,color:${c.muted},fill:transparent`);
  return `${source.trimEnd()}\n${defs.join("\n")}\n`;
}

let queue = Promise.resolve();

export default function Diagram({ source, label = "Diagram" }) {
  const box = useRef(null);
  const drawing = useRef(null);
  const reactId = useId();
  const [state, setState] = useState({ svg: "", error: "" });

  useEffect(() => {
    let cancelled = false;
    const theme = box.current?.closest(".print-root") ? "light" : "dark";
    const text = source.trim();
    if (!text) { setState({ svg: "", error: "" }); return; }
    // Mermaid has one global configuration, so render one diagram at a time.
    queue = queue.then(async () => {
      if (cancelled) return;
      const id = `diagram-${reactId.replace(/[^a-z0-9]/gi, "")}-${Date.now()}`;
      try {
        const mermaid = await loadMermaid();
        mermaid.initialize(config(theme));
        const { svg } = await mermaid.render(id, withNoteClasses(text, theme));
        if (!cancelled) setState({ svg, error: "" });
      } catch (error) {
        // A failed render leaves its scratch element at the end of the page.
        document.getElementById(`d${id}`)?.remove();
        if (!cancelled) setState((previous) => ({ svg: previous.svg, error: String(error?.message || error).split("\n").slice(0, 3).join(" ") }));
      }
    });
    return () => { cancelled = true; };
  }, [source, reactId]);

  // Mermaid shrinks a wide diagram to fit; past a point the labels are unreadable, so stop at 600px and scroll instead.
  useEffect(() => {
    const svg = drawing.current?.querySelector("svg");
    const natural = parseFloat(svg?.style.maxWidth || "");
    if (svg && natural) svg.style.minWidth = `${Math.min(natural, 600)}px`;
  }, [state.svg]);

  return (
    <figure className="diagram" ref={box} aria-label={label}>
      {state.svg && <div ref={drawing} className={state.error ? "diagram-svg diagram-stale" : "diagram-svg"} dangerouslySetInnerHTML={{ __html: state.svg }} />}
      {!state.svg && !state.error && <div className="diagram-loading">Drawing…</div>}
      {state.error && (
        <figcaption className="diagram-error">
          <strong>This diagram has a mistake.</strong> {state.error}
          {!state.svg && <pre><code>{source}</code></pre>}
        </figcaption>
      )}
    </figure>
  );
}
