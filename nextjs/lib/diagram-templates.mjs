// Starting points for /diagram, in Mermaid (https://mermaid.js.org). Each is short enough to read at a glance and edit by
// hand. In flowcharts, A:::c1 colors a shape amber, :::c2 teal, :::c3 violet, :::c4 rose, :::muted dashed grey.
// Safe to import from client components.

export const templates = [
  {
    key: "steps",
    label: "Steps",
    hint: "A process, top to bottom",
    source: `flowchart TD
  A[Script and shot list]:::c1 --> B[Character sheets]:::c2
  B --> C[Keyframe stills]
  C --> D{Consistent?}
  D -- yes --> E[Animate the stills]:::c2
  D -- no --> C
  E --> F[Edit with audio]:::c1`,
  },
  {
    key: "mindmap",
    label: "Mind map",
    hint: "One idea in the middle, branches out",
    source: `mindmap
  root((AI short drama))
    Story
      Folk tale retold
      Small universal want
    Characters
      Over-mature child
      Mascot creature
    Look
      Ink wash
      Indigo and cyan
    Tools
      Video
      Voice
      Music`,
  },
  {
    key: "arc",
    label: "Story arc",
    hint: "Beats left to right",
    source: `flowchart LR
  A[Setup<br/>girl keeps house]:::c2 --> B[Inciting<br/>finds the scroll]:::c2
  B --> C[Rising<br/>paints a creature]:::c1
  C --> D[Climax<br/>one wish]:::c4
  D --> E[Ending<br/>the smaller wish]:::c3`,
  },
  {
    key: "characters",
    label: "Characters",
    hint: "Who relates to whom",
    source: `flowchart LR
  Mei([Mei]):::c2
  Grandpa([Grandfather]):::c1
  Ink([Ink creature]):::c3
  Dragon([Dragon]):::c4
  Mei -- cares for --> Grandpa
  Mei -- paints --> Ink
  Ink -- grows into? --> Dragon
  Dragon -. one wish .-> Mei`,
  },
  {
    key: "timeline",
    label: "Timeline",
    hint: "Events in order",
    source: `timeline
  title Production
  Week 5 : Research : Inspiration board
  Week 6 : Character sheets : Test shots
  Week 7 : Generate scenes : Voice and music
  Week 8 : Edit : Podcast`,
  },
  {
    key: "conversation",
    label: "Conversation",
    hint: "Who says what, in order",
    source: `sequenceDiagram
  participant M as Mei
  participant G as Grandfather
  M->>G: I made rice for two
  G-->>M: You should have eaten first
  Note over M,G: She doesn't say she already did`,
  },
  {
    key: "blank",
    label: "Blank",
    hint: "Start from nothing",
    source: `flowchart TD
  A[First idea] --> B[Next]`,
  },
];
