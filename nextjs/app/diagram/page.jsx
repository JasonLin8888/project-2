import { SiteHeader } from "../components/Chrome.jsx";
import DiagramClient from "./DiagramClient.jsx";

export const dynamic = "force-dynamic";

export const metadata = { title: "Draw a diagram" };

// Draw a diagram in Mermaid with a live preview, then save it to the Notebook: as a new note, or as a new section at the
// end of a note (`?to=notebook/<note>`, which the "Add a diagram" link on each note page fills in).
export default async function DiagramPage({ searchParams }) {
  const { to = "" } = await searchParams;
  return (
    <>
      <SiteHeader current="diagram" />
      <main id="main" className="capture-main diagram-main">
        <header className="capture-heading">
          <p className="eyebrow">Diagram</p>
          <h1>Draw a diagram</h1>
          <p>Pick a starting shape, change the words, and watch it redraw with clean lines. Save it to your <a className="inline-link" href="/notebook">Notebook</a> as a new note, or add it to the end of one you're writing.</p>
        </header>
        <DiagramClient to={typeof to === "string" ? to : ""} />
      </main>
    </>
  );
}
