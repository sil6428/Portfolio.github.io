import Link from "next/link";

const skills = [
  ["Networks", "IPv4/IPv6, VLANs, trunking, DHCP, DNS, NAT, STP, OSPF, EIGRP"],
  ["Security", "Threat analysis, hardening, access control, firewalls, IDS/IPS, incident response"],
  ["Development", "Python, TypeScript, JavaScript, React, Next.js, Node.js, REST APIs"],
  ["Tools", "Linux, Windows Server, Wireshark, Packet Tracer, SecureCRT, Git, Cloudflare"],
];

const timeline = [
  {
    role: "Bachelor of Information Technology",
    place: "Ontario Tech University",
    date: "09/2024 — Present",
    detail: "Networking and Cybersecurity, graduating in 2028. Studying network architecture, systems, programming, and security fundamentals.",
  },
  {
    role: "Sales Associate",
    place: "Winners · Oshawa, ON",
    date: "05/2025 — Present",
    detail: "Support customers, process transactions accurately, maintain displays, and coordinate with the team during high-traffic periods.",
  },
  {
    role: "Summer Day Camp Counsellor",
    place: "Al Arqam Islamic Centre",
    date: "05/2023 — 07/2023",
    detail: "Led activities, managed groups, communicated with families, and supported logistics for more than 100 attendees.",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Info() {
  return (
    <main>
      <header className="site-header">
        <Link className="identity" href="/"><strong>Affan Shaikh</strong><span>Student studying cybersecurity</span></Link>
        <p className="sidebar-location"><span>Location</span>Oshawa, Ontario</p>
        <nav className="nav-pill" aria-label="Primary navigation">
          <Link href="/">Work</Link><Link className="active" href="/info">Info</Link><Link href="/interests">Interests</Link>
        </nav>
        <div className="header-links">
          <a href="mailto:ffaanshake@gmail.com">Email <Arrow /></a>
          <a href="https://www.linkedin.com/in/sil6428" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          <a href="https://github.com/sil6428" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          <a href="tel:+16473091927">Phone <Arrow /></a>
        </div>
      </header>

      <section className="info-hero wrap">
        <p className="section-label"><span /> About</p>
        <h1>I&apos;m Affan, a cybersecurity student who learns best by building.</h1>
        <div className="info-intro">
          <div className="profile-facts" aria-label="Profile details">
            <div><span>Location</span><strong>Oshawa, Ontario</strong></div>
            <div><span>Education</span><strong>Ontario Tech University</strong></div>
            <div><span>Graduation</span><strong>2028</strong></div>
            <div><span>Current focus</span><strong>Networks and cybersecurity</strong></div>
          </div>
          <div className="story">
            <h2>A little context</h2>
            <p>
              I&apos;m a student studying cybersecurity at Ontario Tech University, graduating in 2028. My work moves between
              configuring networks, understanding security controls, and building software that solves clear problems.
            </p>
            <p>
              I learn best by building. A lab teaches me why a route fails. A small application makes access control
              concrete. Each project gives me a new system to understand and improve.
            </p>
            <p>
              I currently handle Google Workspace and website hosting for a developing nonprofit, coordinate the team
              building its website, and contribute a smaller share of the implementation while preparing for the
              CompTIA Security+ certification.
            </p>
          </div>
        </div>
      </section>

      <section className="skills-section wrap">
        <div className="section-heading"><p><span /> Skills and tools</p><span>Still learning</span></div>
        <div className="skill-grid">
          {skills.map(([title, detail], index) => (
            <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{detail}</p></article>
          ))}
        </div>
      </section>

      <section className="interests-section wrap">
        <div className="section-heading"><p><span /> Outside school</p><span>Interests</span></div>
        <div className="interests-bridge">
          <div>
            <p>Badminton, photography, 3D printing, long stories, and an increasingly ambitious home lab.</p>
            <h2>There&apos;s more to me than school and projects.</h2>
          </div>
          <Link href="/interests">Explore my interests <Arrow /></Link>
        </div>
      </section>

      <section className="timeline-section wrap">
        <div className="section-heading"><p><span /> Experience</p><span>Past &amp; present</span></div>
        <div className="timeline">
          {timeline.map((item) => (
            <article key={item.role}>
              <div><h2>{item.place}</h2><p>{item.role}</p></div>
              <time>{item.date}</time>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="volunteer wrap">
        <p className="section-label"><span /> COMMUNITY</p>
        <h2>430 hours spent helping people gather, learn, and participate.</h2>
        <div>
          <p><strong>400 hours</strong> supporting registration, guest service, crowd flow, setup, and attendee needs at Al Arqam Islamic Centre.</p>
          <p><strong>30 hours</strong> coordinating logistics, setup, front-line support, and flow control for a YCC519 community event.</p>
        </div>
      </section>

      <section className="closing wrap">
        <p className="eyebrow">OPEN TO CO-OP OPPORTUNITIES</p>
        <h2>Let&apos;s build something useful.</h2>
        <div className="contact-actions">
          <a href="mailto:ffaanshake@gmail.com">Email <Arrow /></a>
          <a href="https://www.linkedin.com/in/sil6428" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          <a href="https://github.com/sil6428" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          <a href="tel:+16473091927">Phone <Arrow /></a>
          <a href="/Affan_Shaikh_Resume.pdf?v=2026-08-17-dense" target="_blank">Resume <Arrow /></a>
        </div>
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
