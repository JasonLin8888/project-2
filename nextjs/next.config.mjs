import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

// The app is in nextjs/; its Markdown is in content/, recordings land in ../_media/, so the repo root is the root for
// Turbopack and for file tracing.
export default {
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.local"],
  turbopack: { root: path.resolve(appRoot, "..") },
  outputFileTracingRoot: path.resolve(appRoot, ".."),
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};
