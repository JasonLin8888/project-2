# tdm155ai-week-5

TDM 155AI (*Making Stuff in the Age of AI*), week 5: **The Notebook** — research, notetaking, writing, creating, AI. Class meets Wednesday 2026-10-07. The Learning Lab's theme that week is AI for research, dramaturgy, and context packs.

This repo is the week's **workbook**: a local Next app that renders two folders of Markdown (our docs and the student's notebook), with lightweight dictation and photo transcription. It is private for now, and nested in `ll-26-27/ll-week-5` at `apps/tdm155ai-week-5/`. Planning stays in the mk-27 workbook.

Two folders of Markdown at the repo root, each a section of the site at the same path (`docs/course-docs/how-it-works.md` is `/docs/course-docs/how-it-works`). Every folder is a page showing its `README.md` above a list of what it holds; names starting with `_` or `.` are skipped.

- **`docs/`**: what we prepared for the week, in four parts. `docs/README.md` can set `print_set:` for `/print/set`.
  - **`docs/course-docs/`**: the Unit 2 project (`unit-2-project.md`, from week 4's draft) and how the workbook works.
  - **`docs/how-to/`**: Claude's ideas on how to make the student's project.
  - **`docs/ai-research/`**: essays and research written with AI, starting with `notetaking-and-workbooks/`. Every page here carries an "AI-generated" label.
  - **`docs/readings/`**: the reading still to do.
- **`notebook/`**: the student's own work. Dictated and photographed notes are written here, one file each, named `<yyyymmdd-hhmm>-<title>.md`, newest first; anything else added here is a page too.
- **`_media/dictation/`**: gitignored, local only. Each recording (`<id>.wav`, 16 kHz mono) with a `<id>.json` beside it holding the raw transcript, the models, and which note it became.
- **`utils/`**: the image and text generation scripts from weeks 2 and 4, for OpenRouter, fal, and HUIT. Run them from the repo root with the keys in the root `.env`; see [utils/README.md](utils/README.md). What they make lands in `output/` (gitignored).
- **`nextjs/`**: the app: forced dark, Inter, with a red accent; `/print` is always light.

Frontmatter (all optional): `title`, `description`, `eyebrow`, `updated`, `order`. Each folder's README sets `step:` (with `subtitle`, and optionally `tool`, `tool_title`), which makes it a numbered step on the home page.

| URL | What |
| --- | --- |
| `/` | The two folders as steps, the tools, and a map of everything |
| `/docs/...`, `/notebook/...` | Any folder or document in `docs/` or `notebook/` |
| `/dictate` | Record a note (button or space bar), with an optional line of context. The recording is saved, transcribed by `TRANSCRIBE_MODEL`, cleaned up by `CLEANUP_MODEL`, and written to `notebook/`. |
| `/transcribe` | Photograph pages with the camera or upload images; a faithful transcription is written to `notebook/` (see below). |
| `/print` | Light print versions on Letter (the one light surface): put `/print` in front of any page's address, or `/print/all` |

## Run it

Use Node 22 or later (`nextjs/.node-version`).

```sh
cd nextjs
pnpm install
pnpm dev
```

Then open the localhost address it prints. Recording needs Chrome or Safari on the same machine (the microphone requires localhost or HTTPS).

Copy `nextjs/.env.example` to `nextjs/.env.local` and set `OPENROUTER_API_KEY` (`FAL_API_KEY` and `HUIT_API_KEY` are there too, unused by the app so far). The root `.env.example` (copy to `.env`) has the same three keys for scripts run from the repo root. Without it, `/dictate` and `/transcribe` ask for the user's own OpenRouter key, keep it in that browser (localStorage), and send it with each request in an `X-OpenRouter-Key` header; the server uses it for that request only and never writes it to disk. With no key at all, recordings and photographs are saved but not transcribed. The models default to `google/gemini-3.8-flash` (transcription; it has to accept audio) and `anthropic/claude-sonnet-5.5` (cleanup). Restart `pnpm dev` after editing it.

The app reads and writes the local disk, so it is built to run on a laptop. On a deploy (root directory `nextjs`) the `docs/` pages and `/print` would work, but dictation and transcription can't be saved.

## How a recording becomes a note

1. The browser records with `MediaRecorder`, then decodes and resamples the audio to 16 kHz mono WAV, which every audio model on OpenRouter accepts.
2. `/api/dictate` saves the WAV to `_media/dictation/` first, so a failed model call never loses it.
3. The audio model transcribes it word for word (`lib/dictate.mjs`).
4. The text model turns the transcript into a titled Markdown document, keeping the speaker's words and adding nothing they didn't say. If this step fails, the note is written with the raw transcript.

## Where this came from

Created 2026-10-04 with a README and `content/`. On 2026-10-07 it became a workbook app: the docs reader and dictation come from `ll-26-27/mk-video-note-machine` (`6edef79`, without `/interview`), and the `/context` mount from `ll-26-27/ll-week-5-interface` (`27c839a`), pointed at this repo's own `_context/` instead of the parent's. The `/capture` route was renamed `/dictate`, and notes initially went to `_context/dictation/` instead of `content/notes/`. Later that day `content/` moved from `nextjs/` to the repo root.

## Notebook: voice and photographs (2026-10-07)

`/dictate` and `/transcribe` both write new Markdown files into `notebook/`, displayed at `/notebook`. The old `/context/notebook` and `/context/dictation` addresses redirect there.

`/transcribe` accepts live webcam photographs or uploaded JPEG, PNG, and WebP images, with previews, removal, and page ordering. It preserves the photographed wording, marks illegible text, and embeds the source photographs below the transcription. Originals and the model output are kept in the gitignored `_media/notebook/` folder before a note is written. Set `PHOTO_TRANSCRIBE_MODEL` to an image-input OpenRouter model; it falls back to `TRANSCRIBE_MODEL`.

Limits: 12 images, 10 MB per image, 30 MB total. The API rejects other formats and uses generated filenames. Both capture flows require a local writable filesystem; a static deployment does not persist notebook entries.

## Docs and Notebook (2026-10-07)

Later on 2026-10-07 `content/` and `_context/` were replaced by three folders split by who wrote them (Marlon): `docs/` (our instructions, from `content/README.md` and `content/guides/`), `ai/` (AI-generated essays, from `content/notetaking-and-workbooks/`), and `notebook/` (the student's own work, from `_context/notebook/`). The same day `ai/` folded back into `docs/` (Marlon: no "ai" folder or homepage section): `docs/ai-research/` (from `ai/`), `docs/readings/` (reading still to do), `docs/how-to/` (Claude's ideas for the project), and `docs/course-docs/` (from `docs/guides/`, plus the Unit 2 project). Old addresses (`/guides/...`, `/docs/guides/...`, `/ai/...`, `/notetaking-and-workbooks/...`, `/context/...`) redirect to the new ones.

## Homepage Notebook wink (2026-10-07)

The homepage links to Notebook with a small cinematic joke. Its discreet `gosling` button mounts the supplied YouTube video as a looping, muted, viewport-filling background behind the page. Sound on/off, a close button, and Escape control the detour. Closing it or leaving the page removes the iframe and stops playback. No player is loaded before the button is pressed. Embed parameters follow [YouTube’s player documentation](https://developers.google.com/youtube/player_parameters).

The background now uses the unletterboxed video `jefNSYYFm5w`, with Sun mode (0:33–2:12 / 33–132 seconds) and Rain mode (2:29–4:09 / 149–249 seconds). The mode toggle and Sound on/off sit beside `gosling`. Switching modes jumps to the selected section, and the IFrame Player API reloads that same bounded section at the end; native YouTube playlist looping restarts at 0:00. The cinema-wide footage is still contained inside YouTube’s 16:9 player, so cover sizing crops the player’s empty bands and follows the viewport container for portrait, landscape, and ultrawide screens.

For the brightness preview, the background’s dark green-black overlay was changed from 63% opacity to 0% on 2026-10-07.
