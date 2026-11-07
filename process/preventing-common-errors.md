---
title: Preventing common errors
description: Splitting the production into small, redoable pieces, and keeping characters consistent across generations.
order: 6
source: "Tab 2 (“Preventing common errors I see”) of the Google Doc “TDM155AI - Media Inspiration Board”, exported 2026-10-07."
---

# Preventing common errors

From tab 2, *Preventing common errors I see*, of [*TDM155AI - Media Inspiration Board*](https://docs.google.com/document/d/17gIm47t000_5_PasGklTHhs3f8hmvAtOcnp2sxa1ZIo/edit?usp=sharing), copied 2026-10-07. Written with AI.

## Keeping Control of Audio, Visuals, and Character Consistency

### Part 1: Segmenting the production so fixes stay small

**Build in layers, not one big generation.** Most problems come from asking one prompt to do everything. Split the film so each piece can be redone on its own:

1. **Script and shot list first.** Number every shot (S01, S02...) with its dialogue, duration, camera angle, and location. A fix then means "redo S14," not "redo the film."
2. **Short clips, not long takes.** Generate 4-8 second shots and cut them together in an editor (CapCut, DaVinci Resolve, Premiere). One bad shot costs you one clip.
3. **Separate the audio from the video.** This is the biggest fix for mispronunciations:
   * Generate dialogue with a dedicated text-to-speech tool, or record it yourself, as its own track.
   * Generate the visuals with no dialogue, or with dialogue you plan to replace.
   * Sync in the editor, or use a lip-sync tool to match mouths to the audio.
4. **Keep each line of dialogue as its own audio file**, named by shot (S14_line02.wav). If a word is wrong, regenerate only that line.
5. **Fix pronunciation without rewriting the script.** Spell the word phonetically in the TTS input ("Zhang Sengyou" → "Jahng Sung-yo"), or add a pause or hyphenation. Many TTS tools also have a pronunciation dictionary or phoneme setting.
6. **Patch instead of redo.**
   * Audio: cut the bad word out and drop in a re-generated clip of just that word or phrase.
   * Video: use a bad-frame replacement, like cutting away to a reaction shot, insert shot, or b-roll during the flawed moment.
   * Images: use inpainting or region editing to change only the flawed area (a hand, a face, an eye) instead of regenerating the whole image.
7. **Save everything.** Keep the prompt, seed (if the tool shows one), and settings for every good shot so you can reproduce or extend it.

### Part 2: Giving your AI "memory" of your characters

Current AI tools don't truly remember characters between generations. You have to re-supply the information each time. The reliable approach is a **character bible** plus **reference images**.

**1. Make a character sheet for each main character.**

* Front, side, three-quarter, and back views in a neutral pose.
* Close-ups of the face with a few expressions (neutral, happy, sad, angry).
* Full-body shot showing the outfit.
* Generate it as one "turnaround" image, or as a set of images in the same style and lighting. A plain background helps.

**2. Write a locked text description.** Something you paste into every prompt, word for word:

> "Mei, 12-year-old girl, shoulder-length black hair with a red ribbon on the left side, round face, small scar above the right eyebrow, faded indigo robe with white cloud patterns, bare feet."

Use exactly the same wording every time. Small rewordings cause drift.

**3. Upload reference images with every generation.** Most image and video tools now let you attach one or more reference images. Attach the character sheet plus any shot-specific references (the location, the dragon, the prop). Check your tool's current options, since features like "reference images," "character/subject references," and start or end frames vary by tool and change often.

**4. Build the pipeline in stages.**

* Create the character sheet → create a **keyframe still** for each shot using the sheet as reference → animate the keyframe into video.
* It's much easier to fix consistency in a still than in a video, so approve the still before animating.

**5. Keep the style locked.** Put the art style, lighting, and color palette in every prompt ("ink-wash illustration style, indigo palette, soft paper texture"). Stylized art tends to stay consistent more easily than photorealism.

**6. Plan shots around the tool's weaknesses.**

* Hard cases: complex angles, fast movement, hands, and characters turning away or leaving and re-entering the frame.
* Workarounds: over-the-shoulder shots, silhouettes, close-ups on distinct features, and cutting away before a difficult angle.
* Give your characters a few **distinctive, simple identifiers** (a red ribbon, a scar, a bold robe pattern). These survive regeneration better than subtle facial features.

**7. Check continuity as you go.** Put the approved frames side by side, or scrub through the rough cut, before you commit to final renders.

### A simple folder structure

```
/project
  /script_and_shotlist
  /characters (sheets, reference images, locked descriptions)
  /keyframes (S01.png, S02.png...)
  /video_clips (S01_v1.mp4, S01_v2.mp4...)
  /audio (S01_line01.wav ...)
  /final_edit
```

