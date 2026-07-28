import Link from "next/link";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

const interests = [
  {
    number: "01",
    slug: "badminton",
    kicker: "REGIONAL COMPETITOR",
    title: "Badminton",
    lead: "Fast decisions, controlled movement, and the discipline to keep improving one rally at a time.",
    body:
      "I competed at the regional level in badminton. Training taught me to stay composed when a match changes quickly, notice patterns in an opponent’s play, and keep working when progress comes in small increments.",
    detail: "Regional level · Singles & doubles · Still playing",
    visual: (
      <div className="court-visual" aria-hidden="true">
        <div className="court-lines"><i /><i /><i /><i /></div>
        <div className="shuttle"><span /><b /></div>
        <small>MATCH POINT</small>
      </div>
    ),
  },
  {
    number: "02",
    slug: "3d-printing",
    kicker: "FROM FILE TO PHYSICAL",
    title: "3D printing & design",
    lead: "I like watching an idea move from a digital model to something I can hold, refine, and display.",
    body:
      "My larger builds include a katana inspired by Elden Ring and Leon’s hand cannon from Red Dead Redemption. Printing the pieces is only the start. Scaling, tolerances, assembly, sanding, and finishing turn every prop into a long problem-solving process.",
    detail: "Modelling · Slicing · Assembly · Finishing",
    visual: (
      <div className="printer-visual" aria-hidden="true">
        <div className="printer-frame"><span className="printer-head" /><i className="print-bed" /><b className="print-model" /></div>
        <div className="layer-readout">LAYER <strong>284</strong><span /></div>
      </div>
    ),
  },
  {
    number: "03",
    slug: "reading",
    kicker: "CURRENTLY READING",
    title: "Web novels, manhwa & manga",
    lead: "Long stories with dense worlds, patient character development, and systems that reward close attention.",
    body:
      "I spend a lot of time reading East Asian novels, Korean manhwa, and manga. I’m currently working through Lord of the Mysteries and Reverend Insanity. I enjoy stories that take their time, build consistent worlds, and let small details matter later.",
    detail: "Lord of the Mysteries · Reverend Insanity",
    visual: (
      <div className="books-visual" aria-hidden="true">
        <div className="book book-one"><small>01</small><strong>LORD OF THE<br />MYSTERIES</strong><span>IN PROGRESS</span></div>
        <div className="book book-two"><small>02</small><strong>REVEREND<br />INSANITY</strong><span>IN PROGRESS</span></div>
        <div className="page-count">BOOKMARK / 2026</div>
      </div>
    ),
  },
  {
    number: "04",
    slug: "photography",
    kicker: "MOMENTS I WANT TO KEEP",
    title: "Photography",
    lead: "I like ordinary scenes with good light, strong colour, or a detail that makes me stop walking.",
    body:
      "Photography gives me a reason to pay closer attention. I enjoy finding frames in everyday places, keeping the edit simple, and building a visual record of what caught my eye. My VSCO will live here once I finish organizing it.",
    detail: "Street details · Light · Colour · Everyday moments",
    visual: (
      <div className="photo-visual" aria-hidden="true">
        <div className="photo-frame photo-a"><span>01</span></div>
        <div className="photo-frame photo-b"><span>02</span></div>
        <div className="photo-frame photo-c"><span>03</span></div>
        <small>CONTACT SHEET / IN PROGRESS</small>
      </div>
    ),
  },
  {
    number: "05",
    slug: "home-lab",
    kicker: "CURRENT BUILD",
    title: "The Proxmox home lab",
    lead: "Old computers are becoming a small server environment built for experiments, mistakes, and learning.",
    body:
      "I’m repurposing older computers into a Proxmox server for the fun of it. The goal is to learn virtualization through direct use: creating virtual machines, separating services, testing networking ideas, monitoring resources, and finding practical jobs for hardware that would otherwise sit unused.",
    detail: "Proxmox · Virtual machines · Networking · Reused hardware",
    visual: (
      <div className="rack-visual" aria-hidden="true">
        <div className="rack-unit"><span>NODE 01</span><i /><i /><b>ONLINE</b></div>
        <div className="rack-unit"><span>NODE 02</span><i /><i /><b>BUILDING</b></div>
        <div className="rack-unit"><span>STORAGE</span><i /><i /><b>READY</b></div>
        <div className="rack-footer"><span /> PROXMOX VE / HOME LAB</div>
      </div>
    ),
  },
];

export default function Interests() {
  return (
    <main>
      <header className="site-header">
        <Link className="identity" href="/"><strong>Affan Shaikh</strong><span>Student studying cybersecurity</span></Link>
        <p className="sidebar-location"><span>Location</span>Oshawa, Ontario</p>
        <nav className="nav-pill" aria-label="Primary navigation">
          <Link href="/">Work</Link><Link href="/info">Info</Link><Link className="active" href="/interests">Interests</Link>
        </nav>
        <div className="header-links">
          <a href="mailto:ffaanshake@gmail.com">Email <Arrow /></a>
          <a href="https://www.linkedin.com/in/sil6428" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          <a href="https://github.com/sil6428" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          <a href="tel:+16473091927">Phone <Arrow /></a>
        </div>
      </header>

      <section className="interests-hero wrap">
        <p className="section-label"><span /> Interests</p>
        <h1>What I spend time on outside class.</h1>
        <p>
          A few things I care about, what I&apos;ve done with them, and what I&apos;m doing next.
        </p>
        <div className="interest-index" aria-hidden="true">
          <span>01 SPORT</span><span>02 MAKING</span><span>03 READING</span><span>04 PHOTOS</span><span>05 HOME LAB</span>
        </div>
      </section>

      <section className="interest-stories wrap">
        {interests.map((interest) => (
          <article className="interest-story" key={interest.title}>
            <div className="interest-story-copy">
              <p className="project-meta">{interest.number} · {interest.kicker}</p>
              <h2>{interest.title}</h2>
              <h3>{interest.lead}</h3>
              <p>{interest.body}</p>
              <small>{interest.detail}</small>
              {interest.title === "Photography" && (
                <a
                  className="interest-link"
                  href="https://vsco.co/sy1len/gallery"
                  target="_blank"
                  rel="noreferrer"
                >
                  View my VSCO <Arrow />
                </a>
              )}
              <Link className="interest-read-more" href={`/interests/${interest.slug}`}>
                Read full notes <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="interest-story-visual">
              {interest.visual}
            </div>
          </article>
        ))}
      </section>

      <section className="closing wrap">
        <p className="eyebrow">BACK TO THE TECHNICAL WORK</p>
        <h2>See what I&apos;m building.</h2>
        <Link href="/#work">View selected work <Arrow /></Link>
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
