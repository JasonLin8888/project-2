import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("diagrams save as new notes, append to existing ones, and stay inside notebook/", async () => {
  const originalCwd = process.cwd();
  const sandbox = await mkdtemp(path.join(os.tmpdir(), "tdm-diagram-test-"));
  await mkdir(path.join(sandbox, "nextjs"));
  await mkdir(path.join(sandbox, "notebook"));
  await mkdir(path.join(sandbox, "docs"));
  await writeFile(path.join(sandbox, "notebook", "README.md"), "---\ntitle: Notebook\ncolors: levels\n---\n");
  await writeFile(path.join(sandbox, "notebook", "ideas.md"), "---\ntitle: Ideas\n---\n\n# Ideas\n\nA scroll.");
  await writeFile(path.join(sandbox, "notebook", "plain.md"), "---\ntitle: Plain\ncolors: off\n---\n\nText");
  await writeFile(path.join(sandbox, "docs", "secret.md"), "keep");
  process.chdir(path.join(sandbox, "nextjs"));
  try {
    const route = await import("../app/api/diagram/route.js");
    const { mermaidBlock } = await import("../lib/diagram.mjs");
    const { getEntry } = await import("../lib/content.mjs");
    const post = (body) => route.POST(new Request("http://localhost/api/diagram", { method: "POST", body: JSON.stringify(body) }));

    // Colors: a note inherits its folder's mode unless it sets its own.
    assert.equal((await getEntry(["notebook", "ideas"])).entry.colors, "levels");
    assert.equal((await getEntry(["notebook", "plain"])).entry.colors, "off");

    assert.equal((await post({ source: "  " })).status, 400);
    const created = await (await post({ title: "Story arc", source: "flowchart LR\n  A --> B" })).json();
    assert.match(created.file, /^notebook\/\d{8}-\d{4}-story-arc\.md$/);
    const note = await readFile(path.join(sandbox, created.file), "utf8");
    assert.match(note, /eyebrow: Diagram/);
    assert.match(note, /# Story arc\n\n```mermaid\nflowchart LR\n  A --> B\n```/);

    const appended = await (await post({ to: "notebook/ideas", title: "How it connects", source: "mindmap\n  root((Scroll))" })).json();
    assert.equal(appended.href, "/notebook/ideas");
    assert.equal(await readFile(path.join(sandbox, "notebook", "ideas.md"), "utf8"), "---\ntitle: Ideas\n---\n\n# Ideas\n\nA scroll.\n\n## How it connects\n\n```mermaid\nmindmap\n  root((Scroll))\n```\n");

    for (const to of ["notebook/../docs/secret", "docs/secret", "notebook/missing", "notebook/README", "notebook/.hidden"]) {
      assert.equal((await post({ to, source: "flowchart TD\n  A" })).status, 404, to);
    }
    assert.equal(await readFile(path.join(sandbox, "docs", "secret.md"), "utf8"), "keep");
    assert.equal((await readdir(path.join(sandbox, "notebook"))).length, 4);

    // Backticks inside a diagram can't close its fence early.
    assert.equal(mermaidBlock("A[```]"), "````mermaid\nA[```]\n````");

    const { notes } = await (await route.GET()).json();
    assert.deepEqual(notes.map((n) => n.slug).sort(), ["notebook/ideas", "notebook/plain", created.file.slice(0, -3)].sort());
  } finally {
    process.chdir(originalCwd);
    await rm(sandbox, { recursive: true, force: true });
  }
});
