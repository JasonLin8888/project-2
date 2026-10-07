import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import { getEntry, notebookRoot } from "./content.mjs";

// Diagrams from /diagram, saved into the notebook as ```mermaid blocks: a new note, or a new ## section at the end of an
// existing one.

export const diagramLimit = 20000;

// A fenced block that can't be closed early by backticks inside the diagram.
export function mermaidBlock(source) {
  const longest = Math.max(2, ...(source.match(/`+/g) || []).map((run) => run.length));
  const fence = "`".repeat(longest + 1);
  return `${fence}mermaid\n${source.trim()}\n${fence}`;
}

// The notes a diagram can be added to, newest first.
export async function notebookNotes() {
  const found = await getEntry(["notebook"]);
  if (!found) return [];
  const out = [];
  const walk = (folder) => { out.push(...folder.docs); folder.folders.forEach(walk); };
  walk(found.entry);
  return out.sort((a, b) => a.order - b.order).map((doc) => ({ slug: doc.slug, title: doc.title }));
}

// notebook/a/b → its Markdown file, only if it's one of the notes listed above (not a README, nothing outside notebook/).
export async function noteFile(slug) {
  if (typeof slug !== "string" || !(await notebookNotes()).some((note) => note.slug === slug)) return null;
  const file = path.resolve(notebookRoot, `${slug.slice("notebook/".length)}.md`);
  return file.startsWith(notebookRoot + path.sep) ? file : null;
}

// Adds the diagram as a new section at the end of the note (under `## heading` when there is one).
export async function appendDiagram(file, { heading, source }) {
  const current = await readFile(/* turbopackIgnore: true */ file, "utf8");
  const gap = current.endsWith("\n\n") ? "" : current.endsWith("\n") ? "\n" : "\n\n";
  const title = heading ? `## ${heading.replace(/\s+/g, " ").trim()}\n\n` : "";
  await appendFile(/* turbopackIgnore: true */ file, `${gap}${title}${mermaidBlock(source)}\n`);
}
