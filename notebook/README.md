---
title: Notebook
author: codex
description: Notes from voice recordings and photographs, newest first.
order: 2
step: 2
subtitle: Your work
tool: /dictate
tool_title: Dictate a note
tools:
  - href: /dictate
    title: Dictate a note
    copy: Talk; get a cleaned-up note.
  - href: /transcribe
    title: Transcribe photos
    copy: Photograph pages; get a faithful transcription.
  - href: /diagram
    title: Draw a diagram
    copy: Clean lines and shapes; save it as a note or add it to one.
list_heading: Your notes
colors: levels
---

# Notebook

[Dictate a note](/dictate), [transcribe photographs](/transcribe), or [draw a diagram](/diagram). All three save Markdown documents here, with the newest entries listed first. Edit them like any other Markdown file; new captures never overwrite an existing note.

Notes here are color-coded by level (`colors: levels`): headings, subheadings, and body text each have a color. Switch any note to `sections` or `off` with the **Colors** switch above it, or in its frontmatter; see [colors and diagrams](/docs/course-docs/colors-and-diagrams).

Dictated notes include a cleaned-up transcript. Photographed notes preserve the writing and mark unclear words; their source photographs appear below the transcription so you can check it.

The Markdown lives in `notebook/` at the root of the repo, and anything else you add there (notes, drafts, sources) is a page too. Audio and raw transcripts stay in `_media/dictation/`; photographs and their transcription records stay in `_media/notebook/`. Those media folders are local and gitignored.
