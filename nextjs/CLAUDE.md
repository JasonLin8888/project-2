@AGENTS.md

# mk-video-note-machine app

A Next app that renders every Markdown file in `content/` (in this folder) at the same path, plus `/capture`, where dictated notes are transcribed and cleaned up by models on OpenRouter (`lib/dictate.mjs`, `app/api/dictate/`) and written to `content/notes/`, and `/print`. See the repo `README.md`. Keep keys in `.env.local` (gitignored).
