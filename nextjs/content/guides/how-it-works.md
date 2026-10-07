---
title: How it works
description: From your voice to a page in _context/dictation/, in three steps.
order: 1
---

# How it works

The workbook has two folders of Markdown and one tool.

- **`nextjs/content/`** holds the docs: this page, the guides, and the week's material. `content/a/b.md` is the page `/a/b`.
- **`_context/`** at the repo root holds the working context: notes, sources, and dictation. `_context/a/b.md` is the page `/context/a/b`.
- **[/dictate](/dictate)** turns your voice into a note in `_context/dictation/`.

## Dictation

1. **Record.** On [/dictate](/dictate), press the button (or the space bar) and talk. Press it again to stop. The browser records from whichever microphone you pick.
2. **Transcribe.** The recording goes to an audio model on OpenRouter, which writes down what you said, word for word.
3. **Clean up.** A second model turns the transcript into a document: it takes out the false starts and filler, fixes the punctuation, gives it a title and headings, and keeps your meaning and your words where it can. It doesn't add facts you didn't say.

The result is saved as `_context/dictation/<date>-<title>.md`, with the recording and the raw transcript in `_media/dictation/` (gitignored, local only) so nothing is lost if the cleanup goes too far.

## Settings

Both models are set in `nextjs/.env.local` (copy `.env.example`):

| Setting | What it does |
| --- | --- |
| `OPENROUTER_API_KEY` | Required for transcription and cleanup. Without it, recordings are still saved. |
| `TRANSCRIBE_MODEL` | An OpenRouter model that accepts audio. |
| `CLEANUP_MODEL` | Any OpenRouter text model. |

Restart `pnpm dev` after editing it.
