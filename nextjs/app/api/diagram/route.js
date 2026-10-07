import { randomUUID } from "node:crypto";
import { stamp, writeNote } from "../../../lib/dictate.mjs";
import { appendDiagram, diagramLimit, mermaidBlock, noteFile, notebookNotes } from "../../../lib/diagram.mjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// The notes a diagram can be added to.
export async function GET() {
  return Response.json({ notes: await notebookNotes() });
}

// { source, title?, to? }: with `to` (a notebook slug), the diagram becomes a new section at the end of that note;
// otherwise it becomes a new note.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Expected JSON." }, { status: 400 }); }
  const source = typeof body?.source === "string" ? body.source.trim() : "";
  const title = typeof body?.title === "string" ? body.title.replace(/\s+/g, " ").trim().slice(0, 120) : "";
  if (!source) return Response.json({ error: "Draw something first." }, { status: 400 });
  if (source.length > diagramLimit) return Response.json({ error: "That diagram is too long to save." }, { status: 413 });

  try {
    if (body.to) {
      const file = await noteFile(body.to);
      if (!file) return Response.json({ error: "That note isn't in your Notebook." }, { status: 404 });
      await appendDiagram(file, { heading: title, source });
      return Response.json({ href: `/${body.to}`, file: `${body.to}.md` });
    }
    const date = new Date();
    const id = `${stamp(date)}-${randomUUID()}`;
    const name = title || `Diagram, ${date.toLocaleDateString("en-US")}`;
    const note = await writeNote({ id, date, title: name, description: "", body: mermaidBlock(source), source: "diagram" });
    return Response.json({ href: `/${note.slug}`, file: note.file });
  } catch (error) {
    return Response.json({ error: `Couldn't save the diagram: ${error.message}` }, { status: 500 });
  }
}
