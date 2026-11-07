import Link from "next/link";
import { getHome, getRoot, sections, site } from "../lib/content.mjs";
import { SiteFooter, SiteHeader } from "./components/Chrome.jsx";
import Markdown from "./components/Markdown.jsx";

export const dynamic = "force-dynamic";

const numerals = ["I", "II", "III", "IV", "V", "VI"];

// A YouTube or Vimeo link becomes an embedded player; anything else is treated as a video file.
function embedUrl(url) {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return "";
}

function FinishedVideo({ src, title }) {
  // YouTube Shorts are vertical (9:16); everything else is shown widescreen.
  const vertical = !src || /youtube\.com\/shorts\//.test(src);
  const frame = `film-frame${vertical ? " film-frame-vertical" : ""}`;
  if (!src) {
    return (
      <div className={`${frame} film-frame-empty`}>
        <p>Add the video link to <code>home.md</code></p>
      </div>
    );
  }
  const embed = embedUrl(src);
  return (
    <div className={frame}>
      {embed ? (
        <iframe src={embed} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
      ) : (
        <video src={src} controls playsInline preload="metadata" />
      )}
    </div>
  );
}

export default async function Home() {
  const [home, root] = await Promise.all([getHome(), getRoot()]);
  const vertical = !home.video || /youtube\.com\/shorts\//.test(home.video);
  const boxes = sections.map((section) => {
    const folder = root.folders.find((entry) => entry.slug === section.slug);
    return { ...section, href: `/${section.slug}`, summary: folder?.subtitle || folder?.description || "" };
  });

  return (
    <>
      <SiteHeader />
      <main id="main" className="home">
        <section className={`film${vertical ? " film-vertical" : ""}`} aria-labelledby="site-title">
          <div className="film-copy">
            <p className="kicker">{home.kicker || site.term}</p>
            <h1 id="site-title">{home.title}</h1>
            {home.tagline && <p className="film-tagline">{home.tagline}</p>}
            <span className="gold-rule" aria-hidden="true" />
            {home.content.trim() && <div className="film-description"><Markdown doc={home} /></div>}
          </div>
          <FinishedVideo src={home.video} title={home.title} />
        </section>

        <section className="behind" aria-labelledby="behind-title">
          <header className="behind-heading">
            <h2 id="behind-title">Behind the film</h2>
            <p>How it was made, in four parts</p>
          </header>
          <nav className="behind-grid" aria-label="Sections">
            {boxes.map((box, index) => (
              <Link href={box.href} className="behind-card" key={box.slug}>
                <span className="behind-numeral" aria-hidden="true">{numerals[index]}</span>
                <strong>{box.title}</strong>
                {box.summary && <span className="behind-summary">{box.summary}</span>}
                <span className="behind-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
