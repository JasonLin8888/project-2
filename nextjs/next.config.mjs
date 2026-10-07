import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

// The app is in nextjs/; its Markdown is in ../content/ and ../_context/, recordings land in ../_media/, so the repo root is the root for
// Turbopack and for file tracing.
export default {
  async redirects() {
    return [
      { source: "/context/dictation/:path*", destination: "/context/notebook/:path*", permanent: false },
      { source: "/print/context/dictation/:path*", destination: "/print/context/notebook/:path*", permanent: false },
      { source: "/notebook", destination: "/context/notebook", permanent: false },
    ];
  },
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.local"],
  turbopack: { root: path.resolve(appRoot, "..") },
  outputFileTracingRoot: path.resolve(appRoot, ".."),
  outputFileTracingIncludes: {
    "/*": ["../content/**/*"],
  },
};
