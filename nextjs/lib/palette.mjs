// The note colors, shared by the pages (globals.css repeats them as --c-* variables), the diagrams, and /diagram.
// Safe to import from client components: no Node modules here.

export const colorModes = ["off", "levels", "sections"];

export const colorModeLabels = { off: "Off", levels: "Levels", sections: "Sections" };

// Four named colors, dark (the site) and light (/print). In "levels": h2 amber, h3 teal, h4 violet. In "sections": teal
// and amber alternate. Diagrams get the same four as classes: A:::c1 (amber), A:::c2 (teal), A:::c3 (violet), A:::c4 (rose).
export const palette = {
  dark: { c1: "#ffb454", c2: "#5ccfc0", c3: "#b69cff", c4: "#ff8fa3", ink: "#ecece6", muted: "#a0a49a", line: "#8d9289", paper: "#121412", wash: "#1a1c19" },
  light: { c1: "#94691d", c2: "#2c63c9", c3: "#5b3fbf", c4: "#b3263f", ink: "#111311", muted: "#555a54", line: "#5f645d", paper: "#ffffff", wash: "#f4f4f0" },
};
