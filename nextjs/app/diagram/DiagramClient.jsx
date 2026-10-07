"use client";

import { useEffect, useRef, useState } from "react";
import { templates } from "../../lib/diagram-templates.mjs";
import Diagram from "../components/Diagram.jsx";

// The unsaved diagram is kept in this browser (localStorage) so a reload doesn't lose it.
const draftKey = "diagram-draft";
function recall() { try { return JSON.parse(localStorage.getItem(draftKey) || "null"); } catch { return null; } }
function remember(draft) { try { draft ? localStorage.setItem(draftKey, JSON.stringify(draft)) : localStorage.removeItem(draftKey); } catch {} }

function fenced(source) {
  return `\`\`\`mermaid\n${source.trim()}\n\`\`\`\n`;
}

export default function DiagramClient({ to: initialTo = "" }) {
  const [source, setSource] = useState(templates[0].source);
  const [preview, setPreview] = useState(templates[0].source);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [to, setTo] = useState(initialTo);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ tone: "muted", text: "" });
  const editor = useRef(null);

  useEffect(() => {
    const draft = recall();
    if (draft?.source) { setSource(draft.source); setPreview(draft.source); setTitle(draft.title || ""); }
    fetch("/api/diagram").then((response) => response.json()).then((data) => setNotes(data.notes || [])).catch(() => {});
  }, []);

  // Redraw shortly after typing stops.
  useEffect(() => {
    const timer = setTimeout(() => setPreview(source), 350);
    remember({ source, title });
    return () => clearTimeout(timer);
  }, [source, title]);

  function applyTemplate(template) {
    const edited = source.trim() && !templates.some((other) => other.source === source);
    if (edited && !confirm("Replace what you've drawn?")) return;
    setSource(template.source);
    setPreview(template.source);
    setStatus({ tone: "muted", text: `${template.label}: ${template.hint.toLowerCase()}. Change the words to make it yours.` });
    editor.current?.focus();
  }

  // Tab indents (Mermaid uses indentation for mind maps) instead of leaving the box.
  function onKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); save(); return; }
    if (event.key !== "Tab" || event.shiftKey) return;
    event.preventDefault();
    const box = event.currentTarget;
    const { selectionStart: start, selectionEnd: end } = box;
    const next = `${source.slice(0, start)}  ${source.slice(end)}`;
    setSource(next);
    requestAnimationFrame(() => { box.selectionStart = box.selectionEnd = start + 2; });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(fenced(source));
      setStatus({ tone: "ok", text: "Copied. Paste it into any note in docs/ or notebook/." });
    } catch {
      setStatus({ tone: "error", text: "Couldn't copy; select the text in the box instead." });
    }
  }

  async function save() {
    if (busy || !source.trim()) return;
    setBusy(true);
    setStatus({ tone: "muted", text: "Saving…" });
    try {
      const response = await fetch("/api/diagram", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source, title, to }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      remember(null);
      setStatus({ tone: "ok", text: `Saved to ${data.file}.`, href: data.href });
    } catch (error) {
      setStatus({ tone: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  const target = notes.find((note) => note.slug === to);

  return (
    <>
      <div className="diagram-templates" role="group" aria-label="Start from">
        {templates.map((template) => (
          <button type="button" key={template.key} title={template.hint} onClick={() => applyTemplate(template)}>{template.label}</button>
        ))}
      </div>
      <div className="diagram-workspace">
        <div className="diagram-editor">
          <label>
            <span className="eyebrow">Save to</span>
            <select value={to} onChange={(event) => setTo(event.target.value)}>
              <option value="">A new note</option>
              {to && !target && <option value={to}>{to}</option>}
              {notes.map((note) => <option key={note.slug} value={note.slug}>The end of: {note.title}</option>)}
            </select>
          </label>
          <label>
            <span className="eyebrow">{to ? "Section heading (optional)" : "Title"}</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={to ? "e.g. How the wish works" : "e.g. Story arc"} />
          </label>
          <label>
            <span className="eyebrow">Diagram</span>
            <textarea ref={editor} value={source} onChange={(event) => setSource(event.target.value)} onKeyDown={onKeyDown} spellCheck={false} aria-describedby="diagram-help" />
          </label>
          <div className="diagram-actions">
            <button type="button" className="primary" onClick={save} disabled={busy || !source.trim()}>{to ? "Add to note" : "Save as a note"}</button>
            <button type="button" onClick={copy} disabled={!source.trim()}>Copy as Markdown</button>
          </div>
          {status.text && (
            <p className={`capture-status capture-status-${status.tone}`} role="status">
              {status.text} {status.href && <a className="inline-link" href={status.href}>Open it →</a>}
            </p>
          )}
          <p className="diagram-help" id="diagram-help">
            <code>A[box] --&gt; B(rounded)</code> draws an arrow; <code>A -- label --&gt; B</code> labels it; <code>C{"{"}question?{"}"}</code> is a diamond and <code>D((idea))</code> a circle.
            Color a shape by adding <code>:::c1</code> <span className="k1">amber</span>, <code>:::c2</code> <span className="k2">teal</span>, <code>:::c3</code> <span className="k3">violet</span>, <code>:::c4</code> <span className="k4">rose</span>, or <code>:::muted</code>.
            In a mind map, indent with Tab to branch. ⌘↩ saves. More in <a className="inline-link" href="/docs/course-docs/colors-and-diagrams">colors and diagrams</a>.
          </p>
        </div>
        <div className="diagram-preview">
          <Diagram source={preview} label="Preview" />
        </div>
      </div>
    </>
  );
}
