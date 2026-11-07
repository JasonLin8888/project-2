# Project 2

My final project for TDM 155AI (*Making Stuff in the Age of AI*, Fall 2026): an AI short drama, and a website that documents how I made it.

The site's homepage shows the finished video ([watch on YouTube](https://youtube.com/shorts/O3zilWkXLdU)) with a short description, and links to four sections:

| Section | What's in it |
| --- | --- |
| **Brainstorming** | Early ideas, the concepts I dropped, and the conversation where the plot took shape |
| **Inspiration** | The reels, AI dramas, anime, and images I studied, with my notes |
| **The Process** | Week by week, the characters and voices, the script, the clip plan, and the production plan |
| **Reflection** | A video reflection: what I learned, and what the tools contributed compared with what I did |

## Run it

You need [Node.js](https://nodejs.org/) 22 or later and [pnpm](https://pnpm.io/installation).

```sh
git clone https://github.com/JasonLin8888/project-2.git
cd project-2/nextjs
pnpm install
pnpm dev
```

Then open the address it prints, usually <http://localhost:3000>.

No API keys are needed to read the site.

## Where things are

The site is built from Markdown files at the top of the repository. Each file is a page at the same path: `process/clip-plan.md` is `/process/clip-plan`, and each folder's `README.md` is that folder's page.

| Path | What |
| --- | --- |
| `home.md` | The homepage: title, tagline, video link, and description |
| `brainstorming/`, `inspiration/`, `process/`, `reflection/` | The four sections |
| `nextjs/` | The website code (Next.js) |
| `docs/`, `notebook/` | Left over from the week 5 workbook this site started from; not linked from the site |
| `utils/` | Scripts for generating text and images, from the course |

Pages marked as written with ChatGPT or Claude say so at the top. Everything else is my own writing.

## Tools I used for the project

- **Video generation:** Seedance 2.5, on Higgsfield
- **Editing:** Final Cut Pro
- **Character designs:** ChatGPT's image generation
- **Script and planning:** ChatGPT and Claude

## Where this came from

This site started as a copy of the course's week 5 workbook app (`tdm155ai-week-5`), redesigned and refilled for this project.
