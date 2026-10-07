# tdm155ai-week-5

TDM 155AI (*Making Stuff in the Age of AI*), week 5: **Research**. Class meets Wednesday 2026-10-07. The Learning Lab's theme that week is AI for research, dramaturgy, and context packs.

This repo is the week's **workbook**: a local Next app that renders a folder of docs and a folder of working context, with a lightweight dictation tool. It is private for now, and nested in `ll-26-27/ll-week-5` at `apps/tdm155ai-week-5/`. Planning stays in the mk-27 workbook.

- **`content/`**: the docs, the site's own Markdown, at the repo root. Every file is a page at the same path (`content/guides/how-it-works.md` is `/guides/how-it-works`), and every folder is a page showing its `README.md` above a list of what it holds. `content/README.md` is the home page's intro. Names starting with `_` or `.` are skipped, and `content/context/` is reserved.
- **`_context/`**: the working context, at the repo root, mounted at `/context` (`_context/dictation/README.md` is `/context/dictation`). Same rules as `content/`.
- **`_context/dictation/`**: dictated notes, one file each, named `<yyyymmdd-hhmm>-<title>.md`, newest first.
- **`_media/dictation/`**: gitignored, local only. Each recording (`<id>.wav`, 16 kHz mono) with a `<id>.json` beside it holding the raw transcript, the models, and which note it became.
- **`utils/`**: the image and text generation scripts from weeks 2 and 4, for OpenRouter, fal, and HUIT. Run them from the repo root with the keys in the root `.env`; see [utils/README.md](utils/README.md). What they make lands in `output/` (gitignored).
- **`nextjs/`**: the app: forced dark, Inter, with a red accent; `/print` is always light.

Frontmatter (all optional): `title`, `description`, `eyebrow`, `updated`, `order`.

| URL | What |
| --- | --- |
| `/` | The intro from `content/README.md`, the tools, and a map of the docs and the context |
| `/<folder>/<page>` | Any folder or document in `content/` |
| `/context/<folder>/<page>` | Any folder or document in `_context/` |
| `/dictate` | Record a note (button or space bar), with an optional line of context. The recording is saved, transcribed by `TRANSCRIBE_MODEL`, cleaned up by `CLEANUP_MODEL`, and written to `_context/dictation/`. |
| `/print` | Light print versions on Letter (the one light surface): put `/print` in front of any page's address, or `/print/all` |

## Run it

Use Node 22 or later (`nextjs/.node-version`).

```sh
cd nextjs
pnpm install
pnpm dev
```

Then open the localhost address it prints. Recording needs Chrome or Safari on the same machine (the microphone requires localhost or HTTPS).

Copy `nextjs/.env.example` to `nextjs/.env.local` and set `OPENROUTER_API_KEY` (`FAL_API_KEY` and `HUIT_API_KEY` are there too, unused by the app so far). The root `.env.example` (copy to `.env`) has the same three keys for scripts run from the repo root. Without it, recordings are saved but not transcribed. The models default to `google/gemini-3.8-flash` (transcription; it has to accept audio) and `anthropic/claude-sonnet-5.5` (cleanup). Restart `pnpm dev` after editing it.

The app reads and writes the local disk, so it is built to run on a laptop. On a deploy (root directory `nextjs`) the `content/` pages and `/print` would work, but dictation can't be saved and `/context` isn't there.

## How a recording becomes a note

1. The browser records with `MediaRecorder`, then decodes and resamples the audio to 16 kHz mono WAV, which every audio model on OpenRouter accepts.
2. `/api/dictate` saves the WAV to `_media/dictation/` first, so a failed model call never loses it.
3. The audio model transcribes it word for word (`lib/dictate.mjs`).
4. The text model turns the transcript into a titled Markdown document, keeping the speaker's words and adding nothing they didn't say. If this step fails, the note is written with the raw transcript.

## Where this came from

Created 2026-10-04 with a README and `content/`. On 2026-10-07 it became a workbook app: the docs reader and dictation come from `ll-26-27/mk-video-note-machine` (`6edef79`, without `/interview`), and the `/context` mount from `ll-26-27/ll-week-5-interface` (`27c839a`), pointed at this repo's own `_context/` instead of the parent's. The `/capture` route was renamed `/dictate`, and notes go to `_context/dictation/` instead of `content/notes/`. Later that day `content/` moved from `nextjs/` to the repo root.
