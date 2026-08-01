"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type FolderId = "home" | "projects" | "networking" | "contact" | "inspiration";
type DocumentId =
  | "about"
  | "archtech"
  | "ssik"
  | "portfolio"
  | "password-manager"
  | "event-planner"
  | "skills"
  | "learning-log"
  | "vlan-lab"
  | "proxmox"
  | "reading"
  | "terminal";

type OsView =
  | { kind: "folder"; id: FolderId }
  | { kind: "document"; id: DocumentId };

type OsItem = {
  id: string;
  label: string;
  meta: string;
  icon: "folder" | "text" | "code" | "pdf" | "link" | "terminal";
  view?: OsView;
  href?: string;
};

type DocumentContent = {
  title: string;
  type: string;
  intro: string;
  bullets?: string[];
  links?: Array<{ label: string; href: string }>;
};

const folders: Record<FolderId, { title: string; path: string; items: OsItem[] }> = {
  home: {
    title: "Home",
    path: "/home/affan",
    items: [
      { id: "projects", label: "Projects", meta: "5 items", icon: "folder", view: { kind: "folder", id: "projects" } },
      { id: "networking", label: "Network Labs", meta: "2 files", icon: "folder", view: { kind: "folder", id: "networking" } },
      { id: "contact", label: "Contact", meta: "5 links", icon: "folder", view: { kind: "folder", id: "contact" } },
      { id: "inspiration", label: "Inspiration", meta: "3 links", icon: "folder", view: { kind: "folder", id: "inspiration" } },
      { id: "about", label: "About.txt", meta: "Text document", icon: "text", view: { kind: "document", id: "about" } },
      { id: "skills", label: "Skills.md", meta: "Markdown", icon: "code", view: { kind: "document", id: "skills" } },
      { id: "resume", label: "Resume.pdf", meta: "PDF document", icon: "pdf", href: "/Affan_Shaikh_Resume.pdf" },
      { id: "learning-log", label: "Learning Log.url", meta: "GitHub link", icon: "link", view: { kind: "document", id: "learning-log" } },
      { id: "reading", label: "Reading-list.txt", meta: "Text document", icon: "text", view: { kind: "document", id: "reading" } },
    ],
  },
  projects: {
    title: "Projects",
    path: "/home/affan/Projects",
    items: [
      { id: "archtech", label: "Archtech.project", meta: "Work in progress", icon: "code", view: { kind: "document", id: "archtech" } },
      { id: "ssik", label: "SSIK.website", meta: "IT consulting", icon: "code", view: { kind: "document", id: "ssik" } },
      { id: "portfolio", label: "Portfolio.repo", meta: "Three.js + React", icon: "code", view: { kind: "document", id: "portfolio" } },
      { id: "password", label: "Password Manager.py", meta: "Python", icon: "code", view: { kind: "document", id: "password-manager" } },
      { id: "events", label: "Event Planner.js", meta: "JavaScript", icon: "code", view: { kind: "document", id: "event-planner" } },
    ],
  },
  networking: {
    title: "Network Labs",
    path: "/home/affan/Network Labs",
    items: [
      { id: "vlan", label: "VLAN Lab.md", meta: "Cisco IOS notes", icon: "text", view: { kind: "document", id: "vlan-lab" } },
      { id: "proxmox", label: "Proxmox-plan.md", meta: "Home-lab plan", icon: "text", view: { kind: "document", id: "proxmox" } },
    ],
  },
  contact: {
    title: "Contact",
    path: "/home/affan/Contact",
    items: [
      { id: "github", label: "GitHub.url", meta: "sil6428", icon: "link", href: "https://github.com/sil6428" },
      { id: "linkedin", label: "LinkedIn.url", meta: "Professional profile", icon: "link", href: "https://www.linkedin.com/in/sil6428" },
      { id: "email", label: "Email.contact", meta: "Send an email", icon: "link", href: "mailto:ffaanshake@gmail.com" },
      { id: "phone", label: "Phone.contact", meta: "Call Affan", icon: "link", href: "tel:+16473091927" },
      { id: "vsco", label: "Photography.url", meta: "VSCO gallery", icon: "link", href: "https://sy1len.vsco.site" },
    ],
  },
  inspiration: {
    title: "Inspiration",
    path: "/home/affan/Inspiration",
    items: [
      { id: "bruno", label: "Bruno Simon.url", meta: "3D interaction reference", icon: "link", href: "https://bruno-simon.com/" },
      { id: "ida", label: "Ida's Gameboy.url", meta: "Device UI reference", icon: "link", href: "https://idas-gameboy.netlify.app/" },
      { id: "jesse", label: "Jesse Zhou.url", meta: "Fluid scene reference", icon: "link", href: "https://www.jesse-zhou.com/" },
    ],
  },
};

const documents: Record<DocumentId, DocumentContent> = {
  about: {
    title: "About.txt",
    type: "Plain text",
    intro: "I am a Networking and Cybersecurity student at Ontario Tech University, graduating in 2028. I like building systems I can take apart, understand, and improve.",
    bullets: ["Networking and cybersecurity", "Full-stack development", "3D printing and design", "Badminton, photography, and home-lab projects"],
  },
  archtech: {
    title: "Archtech.project",
    type: "Project file · Work in progress",
    intro: "Archtech is an unreleased privacy-focused community platform. I am building the product in stages, with secure messaging, publishing, moderation, and role-based access as core requirements.",
    bullets: ["React and Next.js interface", "Cloudflare Workers deployment", "Privacy and access-control planning", "Public demo currently at Stage 4.5"],
    links: [{ label: "Open Stage 4.5 demo", href: "https://sil6428-archtech-stage-4-5.sil6428-archtech.workers.dev" }],
  },
  ssik: {
    title: "SSIK.website",
    type: "Project file · IT consulting",
    intro: "I independently designed and built the public SSIK website. It explains the consulting team's IT services and gives potential clients a clear way to understand the business.",
    bullets: ["Sole website creator", "Service-focused information architecture", "Responsive frontend", "GitHub Pages deployment"],
    links: [
      { label: "Visit SSIK", href: "https://sil6428.github.io/SSIK-website/index.html" },
      { label: "View source", href: "https://github.com/sil6428/SSIK-website" },
    ],
  },
  portfolio: {
    title: "Portfolio.repo",
    type: "Repository · React + Three.js",
    intro: "This portfolio is an interactive 3D room built with procedural models, camera transitions, accessible controls, a simulated operating system, and a Cloudflare deployment.",
    bullets: ["Three.js room and custom models", "Canvas-rendered monitor states", "Keyboard and touch support", "Automated route and content checks"],
    links: [{ label: "View repository", href: "https://github.com/sil6428/Portfolio.github.io" }],
  },
  "password-manager": {
    title: "Password Manager.py",
    type: "Python source note",
    intro: "A command-line password manager built to practise password generation, validation, menu navigation, and encrypted storage fundamentals.",
    bullets: ["Input validation", "Password generation", "Command-line menus", "Encryption fundamentals"],
  },
  "event-planner": {
    title: "Event Planner.js",
    type: "JavaScript source note",
    intro: "A browser-based event planner for adding, editing, displaying, and removing events through DOM manipulation.",
    bullets: ["Create, update, and delete flows", "DOM rendering", "Form validation", "Clear state changes"],
  },
  skills: {
    title: "Skills.md",
    type: "Markdown document",
    intro: "Tools and concepts I have worked with through school, labs, and personal projects.",
    bullets: ["IPv4 and IPv6, VLANs, trunking, DHCP, DNS, NAT, STP, and inter-VLAN routing", "Python, TypeScript, JavaScript, React, Next.js, HTML, and CSS", "Linux, Windows Server, Wireshark, Packet Tracer, Git, GitHub, and Cloudflare Workers", "Authentication, access control, hashing, encryption, and vulnerability analysis fundamentals"],
  },
  "learning-log": {
    title: "Learning Log.url",
    type: "Repository link",
    intro: "A public record of genuine study sessions, networking labs, portfolio development, problems solved, and next steps.",
    links: [{ label: "Open learning log", href: "https://github.com/sil6428/learning-log" }],
  },
  "vlan-lab": {
    title: "VLAN Lab.md",
    type: "Networking lab notes",
    intro: "Practice configurations covering VLAN creation, access ports, trunk links, DHCP, STP, routing, and connectivity testing in Cisco IOS.",
    bullets: ["Build and verify VLANs", "Configure 802.1Q trunks", "Test inter-VLAN routing", "Use show commands and packet captures to troubleshoot"],
  },
  proxmox: {
    title: "Proxmox-plan.md",
    type: "Home-lab plan",
    intro: "I am turning older computers into a Proxmox lab for virtual machines, networking experiments, storage, and self-hosted services.",
    bullets: ["Reuse existing hardware", "Separate test networks", "Practise virtualization and backups", "Document services before exposing anything externally"],
  },
  reading: {
    title: "Reading-list.txt",
    type: "Plain text",
    intro: "I read East Asian web novels, Korean manhwa, and manga. My current long-form reads include Lord of the Mysteries and Reverend Insanity.",
  },
  terminal: {
    title: "Terminal",
    type: "AFFAN_OS shell",
    intro: "affan@lab:~$ help\nfiles      open the Home folder\nprojects   open the Projects folder\nresume     open the resume PDF\nroom       return to the 3D room\n\nThis terminal is a visual system panel. The portfolio's hidden command terminal still lives under the backtick key.",
  },
};

const desktopItems: OsItem[] = [
  { id: "home", label: "Home", meta: "Personal files", icon: "folder", view: { kind: "folder", id: "home" } },
  { id: "projects", label: "Projects", meta: "Development work", icon: "folder", view: { kind: "folder", id: "projects" } },
  { id: "networking", label: "Network Labs", meta: "Lab notes", icon: "folder", view: { kind: "folder", id: "networking" } },
  { id: "about", label: "About.txt", meta: "Profile", icon: "text", view: { kind: "document", id: "about" } },
  { id: "resume", label: "Resume.pdf", meta: "Resume", icon: "pdf", href: "/Affan_Shaikh_Resume.pdf" },
  { id: "contact", label: "Contact", meta: "Links", icon: "folder", view: { kind: "folder", id: "contact" } },
];

function FileIcon({ type }: { type: OsItem["icon"] }) {
  return <span className={`affan-os-icon affan-os-icon-${type}`} aria-hidden="true"><i /></span>;
}

function ExternalMark() {
  return <span className="affan-os-external" aria-hidden="true">↗</span>;
}

export default function DesktopOs({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<OsView | null>(null);
  const [history, setHistory] = useState<OsView[]>([]);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [announcement, setAnnouncement] = useState("AFFAN_OS desktop ready");
  const windowRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (view && !minimized) windowRef.current?.focus();
  }, [view, minimized]);

  const openView = (next: OsView) => {
    if (view) setHistory((current) => [...current, view]);
    setView(next);
    setMinimized(false);
    setLauncherOpen(false);
    setQuery("");
    const label = next.kind === "folder" ? folders[next.id].title : documents[next.id].title;
    setAnnouncement(`Opened ${label}`);
  };

  const closeWindow = () => {
    setView(null);
    setHistory([]);
    setMaximized(false);
    setMinimized(false);
    setAnnouncement("Window closed");
  };

  const goBack = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setView(previous);
    setHistory((current) => current.slice(0, -1));
  };

  const allLauncherItems = useMemo(() => [
    ...desktopItems,
    { id: "terminal", label: "Terminal", meta: "System", icon: "terminal" as const, view: { kind: "document" as const, id: "terminal" as const } },
    { id: "inspiration", label: "Inspiration", meta: "References", icon: "folder" as const, view: { kind: "folder" as const, id: "inspiration" as const } },
  ], []);
  const launcherItems = allLauncherItems.filter((item) => `${item.label} ${item.meta}`.toLowerCase().includes(query.toLowerCase()));

  const activateItem = (item: OsItem) => {
    if (item.view) openView(item.view);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    if (launcherOpen) {
      setLauncherOpen(false);
    } else if (view) {
      closeWindow();
    } else {
      onExit();
    }
  };

  const activeFolder = view?.kind === "folder" ? folders[view.id] : null;
  const activeDocument = view?.kind === "document" ? documents[view.id] : null;
  const activeTitle = activeFolder?.title ?? activeDocument?.title ?? "AFFAN_OS";

  return (
    <section className="affan-os" role="application" aria-label="AFFAN_OS portfolio desktop" onKeyDown={handleKeyDown}>
      <div className="affan-os-wallpaper" aria-hidden="true"><i /><i /><i /></div>
      <header className="affan-os-panel">
        <button className="affan-os-brand" type="button" onClick={() => setLauncherOpen((open) => !open)} aria-expanded={launcherOpen} aria-controls="affan-os-launcher">
          <span aria-hidden="true">A</span> AFFAN_OS
        </button>
        <div className="affan-os-workspaces" aria-label="Virtual desktops">
          <button type="button" className="is-active" aria-label="Current workspace 1">1</button>
          <button type="button" aria-label="Workspace 2">2</button>
        </div>
        <div className="affan-os-tray">
          <span title="Network connected" aria-label="Network connected">NET</span>
          <span title="Interface sound enabled" aria-label="Interface sound enabled">SFX</span>
          <time dateTime={clock.toISOString()}>{clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
          <button type="button" onClick={onExit} aria-label="Shut down AFFAN_OS and return to the room">⏻</button>
        </div>
      </header>

      <main className="affan-os-desktop" aria-label="Desktop files">
        <div className="affan-os-desktop-grid">
          {desktopItems.map((item) => item.href ? (
            <a className="affan-os-desktop-item" href={item.href} target="_blank" rel="noreferrer" key={item.id}>
              <FileIcon type={item.icon} /><span>{item.label}</span>
            </a>
          ) : (
            <button className="affan-os-desktop-item" type="button" onClick={() => activateItem(item)} key={item.id}>
              <FileIcon type={item.icon} /><span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="affan-os-welcome" aria-hidden="true">
          <p>WELCOME BACK</p>
          <strong>Affan&apos;s workspace</strong>
          <span>Projects, labs, and current work.</span>
        </div>
      </main>

      {launcherOpen && (
        <aside className="affan-os-launcher" id="affan-os-launcher" aria-label="Applications menu">
          <div className="affan-os-user"><span aria-hidden="true">AS</span><div><strong>Affan Shaikh</strong><small>Networking + Cybersecurity</small></div></div>
          <label className="affan-os-search">
            <span className="sr-only">Search applications and files</span>
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files and apps" />
          </label>
          <div className="affan-os-launcher-grid">
            {launcherItems.map((item) => item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" key={item.id}><FileIcon type={item.icon} /><span>{item.label}</span></a>
            ) : (
              <button type="button" onClick={() => activateItem(item)} key={item.id}><FileIcon type={item.icon} /><span>{item.label}</span></button>
            ))}
            {launcherItems.length === 0 && <p>No matching files.</p>}
          </div>
          <footer><button type="button" onClick={onExit}>Return to 3D room</button></footer>
        </aside>
      )}

      {view && !minimized && (
        <article className={`affan-os-window ${maximized ? "is-maximized" : ""}`} ref={windowRef} tabIndex={-1} aria-label={`${activeTitle} window`}>
          <header className="affan-os-titlebar">
            <div><span className="affan-os-window-mark" aria-hidden="true" /> <strong>{activeTitle}</strong></div>
            <div className="affan-os-window-controls">
              <button type="button" onClick={() => setMinimized(true)} aria-label={`Minimize ${activeTitle}`}>−</button>
              <button type="button" onClick={() => setMaximized((value) => !value)} aria-label={`${maximized ? "Restore" : "Maximize"} ${activeTitle}`}>{maximized ? "❐" : "□"}</button>
              <button className="is-close" type="button" onClick={closeWindow} aria-label={`Close ${activeTitle}`}>×</button>
            </div>
          </header>

          {activeFolder && (
            <>
              <nav className="affan-os-toolbar" aria-label="File navigation">
                <button type="button" onClick={goBack} disabled={history.length === 0} aria-label="Back">←</button>
                <button type="button" onClick={() => openView({ kind: "folder", id: "home" })} aria-label="Home">⌂</button>
                <div className="affan-os-path" aria-label={`Current path ${activeFolder.path}`}>{activeFolder.path}</div>
                <span>{activeFolder.items.length} items</span>
              </nav>
              <div className="affan-os-file-layout">
                <aside className="affan-os-places" aria-label="Places">
                  <strong>Places</strong>
                  {(["home", "projects", "networking", "contact"] as FolderId[]).map((folderId) => (
                    <button className={view.id === folderId ? "is-current" : ""} type="button" onClick={() => openView({ kind: "folder", id: folderId })} key={folderId}>{folders[folderId].title}</button>
                  ))}
                </aside>
                <div className="affan-os-file-grid" aria-label={`${activeFolder.title} contents`}>
                  {activeFolder.items.map((item) => item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" key={item.id} aria-label={`Open ${item.label} in a new tab`}>
                      <FileIcon type={item.icon} /><span><strong>{item.label}</strong><small>{item.meta}</small></span><ExternalMark />
                    </a>
                  ) : (
                    <button type="button" onClick={() => activateItem(item)} key={item.id}>
                      <FileIcon type={item.icon} /><span><strong>{item.label}</strong><small>{item.meta}</small></span>
                    </button>
                  ))}
                </div>
              </div>
              <footer className="affan-os-statusbar"><span>{activeFolder.items.length} items</span><span>Icons view</span></footer>
            </>
          )}

          {activeDocument && (
            <div className={`affan-os-document ${view.kind === "document" && view.id === "terminal" ? "is-terminal" : ""}`}>
              <div className="affan-os-document-meta"><span>{activeDocument.type}</span><span>Read only</span></div>
              <h1>{activeDocument.title}</h1>
              <p className="affan-os-document-intro">{activeDocument.intro}</p>
              {activeDocument.bullets && <ul>{activeDocument.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              {activeDocument.links && <div className="affan-os-document-actions">{activeDocument.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label}<ExternalMark /></a>)}</div>}
            </div>
          )}
        </article>
      )}

      <footer className="affan-os-taskbar">
        <button className="affan-os-start" type="button" onClick={() => setLauncherOpen((open) => !open)} aria-label="Open applications menu" aria-expanded={launcherOpen}>A</button>
        <button type="button" onClick={() => openView({ kind: "folder", id: "home" })}><FileIcon type="folder" /><span className="sr-only">Open Home</span></button>
        <button type="button" onClick={() => openView({ kind: "document", id: "terminal" })}><FileIcon type="terminal" /><span className="sr-only">Open Terminal</span></button>
        {view && <button className="affan-os-running" type="button" onClick={() => setMinimized((value) => !value)} aria-label={`${minimized ? "Restore" : "Minimize"} ${activeTitle}`}><span />{activeTitle}</button>}
        <div className="affan-os-task-spacer" />
        <button className="affan-os-show-desktop" type="button" onClick={() => setMinimized(true)} aria-label="Show desktop" />
      </footer>
      <p className="sr-only" aria-live="polite">{announcement}</p>
    </section>
  );
}
