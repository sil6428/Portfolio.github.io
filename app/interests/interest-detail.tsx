import type { ReactNode } from "react";
import Link from "next/link";

export type InterestDetailData = {
  index: string;
  title: string;
  label: string;
  summary: string;
  visual: ReactNode;
  facts: Array<[string, string]>;
  links?: Array<{ label: string; href: string }>;
  sections: Array<{
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  nextSlug: string;
  nextTitle: string;
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function InterestDetail({ data }: { data: InterestDetailData }) {
  return (
    <main>
      <header className="site-header">
        <Link className="identity" href="/" aria-label="Affan Shaikh home">
          <strong>Affan Shaikh</strong>
          <span>Student studying cybersecurity</span>
        </Link>
        <p className="sidebar-location"><span>Location</span>Oshawa, Ontario</p>
        <nav className="nav-pill" aria-label="Primary navigation">
          <Link href="/">Work</Link>
          <Link href="/info">Info</Link>
          <Link className="active" href="/interests">Interests</Link>
        </nav>
        <div className="header-links">
          <a href="mailto:ffaanshake@gmail.com">Email <Arrow /></a>
          <a href="https://www.linkedin.com/in/sil6428" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          <a href="https://github.com/sil6428" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          <a href="tel:+16473091927">Phone <Arrow /></a>
        </div>
      </header>

      <article className="interest-detail wrap">
        <div className="case-breadcrumb">
          <Link href="/interests">Interests</Link>
          <span>/</span>
          <span>{data.index}</span>
        </div>

        <header className="interest-detail-hero">
          <div className="interest-detail-intro">
            <p className="project-meta">{data.label}</p>
            <h1>{data.title}</h1>
            <p>{data.summary}</p>
            {data.links && (
              <div className="case-links">
                {data.links.map((link) => (
                  <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                    {link.label} <Arrow />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="interest-story-visual interest-detail-visual">
            {data.visual}
          </div>
        </header>

        <div className="case-layout">
          <aside className="case-facts" aria-label={`${data.title} details`}>
            {data.facts.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </aside>
          <div className="case-content">
            {data.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

        <nav className="case-next" aria-label="Interest navigation">
          <Link href="/interests">← All interests</Link>
          <Link href={`/interests/${data.nextSlug}`}>Next: {data.nextTitle} →</Link>
        </nav>
      </article>

      <footer className="site-footer wrap">
        <div><strong>AFFAN SHAIKH</strong><span>Oshawa, Ontario</span></div>
        <div className="footer-nav"><span>MAIN</span><Link href="/">Work</Link><Link href="/info">Info</Link><Link href="/interests">Interests</Link></div>
        <div className="footer-nav"><span>CONTACT</span><a href="mailto:ffaanshake@gmail.com">Email</a><a href="https://www.linkedin.com/in/sil6428">LinkedIn</a><a href="https://github.com/sil6428">GitHub</a><a href="tel:+16473091927">Phone</a></div>
        <p>© 2026 Affan Shaikh. All rights reserved.</p>
      </footer>
    </main>
  );
}
