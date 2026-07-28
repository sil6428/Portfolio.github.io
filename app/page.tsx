import Link from "next/link";

const projects = [
  {
    number: "01",
    title: "Archtech",
    meta: "Private build · Work in progress",
    description:
      "A privacy-focused community platform for secure messaging, publishing, moderation, and community programs.",
    tags: ["TypeScript", "React", "Next.js", "Workers", "D1", "KV"],
    action: {
      label: "View live demo",
      href: "https://sil6428-archtech-stage-4-5.sil6428-archtech.workers.dev/",
    },
    caseStudy: "/work/archtech",
    source: null,
    accent: "violet",
    visual: (
      <div className="network-visual" aria-hidden="true">
        <span className="node node-a">A</span>
        <span className="node node-b">01</span>
        <span className="node node-c">P</span>
        <span className="node node-d">04</span>
        <i className="line line-a" />
        <i className="line line-b" />
        <i className="line line-c" />
        <div className="privacy-chip"><span /> PRIVATE BY DESIGN</div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Network Lab",
    meta: "Cisco IOS · Systems practice",
    description:
      "Hands-on topologies covering VLANs, routing, DHCP, STP, OSPF, EIGRP, and methodical troubleshooting.",
    tags: ["Packet Tracer", "Cisco IOS", "Wireshark", "SecureCRT"],
    action: null,
    caseStudy: null,
    source: null,
    accent: "cyan",
    visual: (
      <div className="terminal-visual" aria-hidden="true">
        <div><b>affan@lab</b>:~$ show ip route</div>
        <div className="muted">Gateway of last resort is not set</div>
        <div><em>C</em> 10.10.10.0/24 is directly connected</div>
        <div><em>O</em> 10.20.20.0/24 [110/2] via 10.0.0.2</div>
        <div><em>D</em> 10.30.30.0/24 [90/3072] via 10.0.0.6</div>
        <div className="cursor-line"><b>affan@lab</b>:~$ <span /></div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Password Manager",
    meta: "Python · Command line",
    description:
      "A focused CLI project exploring password generation, validation, menu flows, and secure-storage concepts.",
    tags: ["Python", "CLI", "Validation", "Security"],
    action: null,
    caseStudy: null,
    source: null,
    accent: "amber",
    visual: (
      <div className="vault-visual" aria-hidden="true">
        <div className="vault-ring ring-one" />
        <div className="vault-ring ring-two" />
        <div className="vault-core"><span>••••</span><small>ENCRYPTED</small></div>
        <div className="strength">
          <i /><i /><i /><i />
          <span>STRONG</span>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "SSIK Website",
    meta: "IT consulting business · Public website",
    description:
      "I independently designed and built the public website for SSIK, the IT consulting team I work with, to present our services and consultation offer.",
    tags: ["Security Auditing", "Risk Management", "Infrastructure", "IT Advisory"],
    action: {
      label: "View live site",
      href: "https://sil6428.github.io/SSIK-website/index.html",
    },
    caseStudy: "/work/ssik",
    source: {
      label: "Source code",
      href: "https://github.com/sil6428/SSIK-website",
    },
    accent: "coral",
    visual: (
      <div className="website-visual" aria-hidden="true">
        <div className="website-nav"><b>SSIK</b><span>Services</span><span>Projects</span><span>Consultation</span></div>
        <div className="website-hero">
          <small>SECURITY · RISK · INFRASTRUCTURE</small>
          <strong>Secure IT solutions<br />for modern businesses.</strong>
          <i />
        </div>
        <div className="website-cards"><span /><span /><span /></div>
      </div>
    ),
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
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

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="status"><span /> AVAILABLE FOR CO-OP OPPORTUNITIES</div>
          <h1>Hi, I&apos;m Affan. I study cybersecurity and build things to understand how they work.</h1>
          <p className="hero-note">
            I&apos;m at Ontario Tech, graduating in 2028. Lately I&apos;ve been building Archtech,
            studying for Security+, and turning old computers into a Proxmox lab.
          </p>
          <div className="hero-actions">
            <a href="#work">Projects ↓</a>
            <Link href="/info">More about me</Link>
          </div>
        </div>
        <aside className="now-list" aria-label="What Affan is currently doing">
          <h2>Right now</h2>
          <div>
            <span>Building</span>
            <p>Archtech and a home server</p>
          </div>
          <div>
            <span>Studying</span>
            <p>Security+ and network security</p>
          </div>
          <div>
            <span>Reading</span>
            <p>Lord of the Mysteries</p>
          </div>
        </aside>
      </section>

      <section className="work wrap" id="work">
        <div className="section-heading">
          <p><span /> Selected work</p>
          <span>4 projects</span>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className={`project-card ${project.accent}`} key={project.title}>
              <span className="project-number">{project.number}</span>
              <div className="project-copy">
                <p className="project-meta">{project.meta}</p>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </div>
              <div className="project-side">
                <ul>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className="project-actions">
                  {project.caseStudy && (
                    <a className="project-action" href={project.caseStudy}>
                      Read case study <span aria-hidden="true">→</span>
                    </a>
                  )}
                  {project.action && (
                    <a className={`project-action ${project.caseStudy ? "project-action-secondary" : ""}`} href={project.action.href} target="_blank" rel="noreferrer">
                      {project.action.label} <Arrow />
                    </a>
                  )}
                  {project.source && (
                    <a className="project-action project-action-secondary" href={project.source.href} target="_blank" rel="noreferrer">
                      {project.source.label} <Arrow />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing wrap">
        <p className="eyebrow">Contact</p>
        <h2>If you want to talk about any of this, send me an email.</h2>
        <a href="mailto:ffaanshake@gmail.com">ffaanshake@gmail.com <Arrow /></a>
      </section>

      <footer className="site-footer wrap">
        <div><strong>AFFAN SHAIKH</strong><span>Oshawa, Ontario</span></div>
        <div className="footer-nav"><span>MAIN</span><Link href="/">Work</Link><Link href="/info">Info</Link><Link href="/interests">Interests</Link></div>
        <div className="footer-nav"><span>CONTACT</span><a href="mailto:ffaanshake@gmail.com">Email</a><a href="https://www.linkedin.com/in/sil6428">LinkedIn</a><a href="https://github.com/sil6428">GitHub</a><a href="tel:+16473091927">Phone</a></div>
        <p>© 2026 Affan Shaikh. All rights reserved.</p>
      </footer>
    </main>
  );
}
