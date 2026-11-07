import Link from "next/link";
import { sections, site } from "../../lib/content.mjs";

// `current` is the section you're in ("brainstorming", "inspiration", "process", "reflection"), or nothing.
export function SiteHeader({ current = "" }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title}{site.label && <span>{site.label}</span>}
      </Link>
      <nav aria-label="Main navigation">
        {sections.map((section) => (
          <Link key={section.slug} href={`/${section.slug}`} aria-current={current === section.slug ? "page" : undefined}>
            {section.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <span>{site.term}</span>
    </footer>
  );
}
