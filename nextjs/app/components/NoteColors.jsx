"use client";

import { useEffect, useState } from "react";
import { colorModeLabels, colorModes } from "../../lib/palette.mjs";

// The article for a document page, with a switch for its color coding. `initial` is what the frontmatter says (or the
// folder's README); a different choice is remembered for this page in this browser only, so the note itself doesn't
// change until you add `colors:` to its frontmatter.

const storageKey = (slug) => `colors:${slug}`;
function recall(slug) { try { return localStorage.getItem(storageKey(slug)) || ""; } catch { return ""; } }
function remember(slug, mode, initial) {
  try { mode === initial ? localStorage.removeItem(storageKey(slug)) : localStorage.setItem(storageKey(slug), mode); } catch {}
}

export default function NoteColors({ slug, initial = "off", diagramHref = "", children }) {
  const [mode, setMode] = useState(initial);
  useEffect(() => {
    const saved = recall(slug);
    if (colorModes.includes(saved)) setMode(saved);
  }, [slug]);

  function choose(next) {
    setMode(next);
    remember(slug, next, initial);
  }

  return (
    <>
      <div className="note-tools">
        <div className="note-colors" role="group" aria-label="Color coding">
          <span className="eyebrow">Colors</span>
          <span className="note-colors-buttons">
            {colorModes.map((option) => (
              <button type="button" key={option} aria-pressed={mode === option} onClick={() => choose(option)}>
                {option !== "off" && <span className={`note-colors-swatch swatch-${option}`} aria-hidden="true" />}
                {colorModeLabels[option]}
              </button>
            ))}
          </span>
        </div>
        {diagramHref && <a className="note-diagram-link" href={diagramHref}>+ Add a diagram</a>}
      </div>
      {mode !== initial && (
        <p className="note-colors-hint">Only in this browser. To keep it in the note, add <code>colors: {mode}</code> to its frontmatter.</p>
      )}
      <article className={`prose colors-${mode}`}>{children}</article>
    </>
  );
}
