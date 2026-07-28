import Link from "next/link";

type CaseStudyData = {
  index: string;
  title: string;
  label: string;
  summary: string;
  image: string;
  imageAlt: string;
  facts: Array<[string, string]>;
  links: Array<{ label: string; href: string }>;
  sections: Array<{
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  nextSlug?: string;
  nextTitle?: string;
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function CaseStudy({ data }: { data: CaseStudyData }) {
  return (
    <main>
      <header className="site-header">
        <Link className="identity" href="/" aria-label="Affan Shaikh home">
          <strong>Affan Shaikh</strong>
          <span>Student studying cybersecurity</span>
        </Link>
        <p className="sidebar-location"><span>Location</span>Oshawa, Ontario</p>
        <nav className="nav-pill" aria-label="Primary navigation">
          <Link className="active" href="/">Work</Link>
          <Link href="/info">Info</Link>
          <Link href="/interests">Interests</Link>
        </nav>
        <div className="header-links">
          <a href="mailto:ffaanshake@gmail.com">Email <Arrow /></a>
          <a href="https://www.linkedin.com/in/sil6428" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          <a href="https://github.com/sil6428" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          <a href="tel:+16473091927">Phone <Arrow /></a>
        </div>
      </header>

      <article className="case-study wrap">
        <div className="case-breadcrumb">
          {/* A full navigation intentionally resets the scroll position in the deployed worker. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#work">Selected work</a>
          <span>/</span>
          <span>{data.index}</span>
        </div>

        <header className="case-hero">
          <p className="project-meta">{data.label}</p>
          <h1>{data.title}</h1>
          <p>{data.summary}</p>
          <div className="case-links">
            {data.links.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                {link.label} <Arrow />
              </a>
            ))}
          </div>
        </header>

        <figure className="case-cover">
          {/* Static project captures are served directly because the Worker does not use an image-optimization service. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image}
            alt={data.imageAlt}
            width="1280"
            height="720"
            loading="eager"
            decoding="async"
          />
          <figcaption>Current public build</figcaption>
        </figure>

        <div className="case-layout">
          <aside className="case-facts" aria-label={`${data.title} project facts`}>
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

        <nav className="case-next" aria-label="Case study navigation">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#work">← All projects</a>
          {data.nextSlug && data.nextTitle && (
            <a href={data.nextSlug}>Next: {data.nextTitle} →</a>
          )}
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
