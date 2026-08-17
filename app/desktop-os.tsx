"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { learningLogEntries } from "./learning-log-data.generated";

type StaticFolderId = "home" | "projects" | "networking" | "education" | "experience" | "interests" | "contact" | "inspiration";
type LearningLogFolderId = "learning-log" | `learning-log-${string}-${string}`;
type FolderId = StaticFolderId | LearningLogFolderId;
type StaticDocumentId =
  | "about"
  | "archtech"
  | "ssik"
  | "portfolio"
  | "cicids2017"
  | "password-manager"
  | "event-planner"
  | "skills"
  | "education"
  | "certification"
  | "work-experience"
  | "volunteer"
  | "vlan-lab"
  | "proxmox"
  | "reading"
  | "badminton"
  | "3d-printing"
  | "photography"
  | "home-lab"
  | "resume"
  | "terminal";
type LearningLogDocumentId = `learning-log-entry-${string}`;
type DocumentId = StaticDocumentId | LearningLogDocumentId;

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
  body?: string;
  publishedAt?: string;
  links?: Array<{ label: string; href: string }>;
};

type FolderContent = { title: string; path: string; items: OsItem[] };

const baseFolders: Record<StaticFolderId, FolderContent> = {
  home: {
    title: "Home",
    path: "/home/affan",
    items: [
      { id: "projects", label: "Projects", meta: "6 items", icon: "folder", view: { kind: "folder", id: "projects" } },
      { id: "networking", label: "Network Labs", meta: "2 files", icon: "folder", view: { kind: "folder", id: "networking" } },
      { id: "education", label: "Education", meta: "2 files", icon: "folder", view: { kind: "folder", id: "education" } },
      { id: "experience", label: "Experience", meta: "2 files", icon: "folder", view: { kind: "folder", id: "experience" } },
      { id: "interests", label: "Interests", meta: "5 files", icon: "folder", view: { kind: "folder", id: "interests" } },
      { id: "contact", label: "Contact", meta: "5 links", icon: "folder", view: { kind: "folder", id: "contact" } },
      { id: "inspiration", label: "Inspiration", meta: "13 links", icon: "folder", view: { kind: "folder", id: "inspiration" } },
      { id: "about", label: "About.txt", meta: "Text document", icon: "text", view: { kind: "document", id: "about" } },
      { id: "skills", label: "Skills.md", meta: "Markdown", icon: "code", view: { kind: "document", id: "skills" } },
      { id: "resume", label: "Resume.pdf", meta: "PDF document", icon: "pdf", view: { kind: "document", id: "resume" } },
      { id: "learning-log", label: "Learning Log", meta: `${learningLogEntries.length} public entries`, icon: "folder", view: { kind: "folder", id: "learning-log" } },
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
      { id: "cicids2017", label: "CICIDS2017.research", meta: "Security data audit", icon: "code", view: { kind: "document", id: "cicids2017" } },
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
  education: {
    title: "Education",
    path: "/home/affan/Education",
    items: [
      { id: "university", label: "Ontario Tech.txt", meta: "Degree and coursework", icon: "text", view: { kind: "document", id: "education" } },
      { id: "security-plus", label: "Security+.plan", meta: "In progress", icon: "text", view: { kind: "document", id: "certification" } },
    ],
  },
  experience: {
    title: "Experience",
    path: "/home/affan/Experience",
    items: [
      { id: "work", label: "Work Experience.txt", meta: "2 positions", icon: "text", view: { kind: "document", id: "work-experience" } },
      { id: "volunteer", label: "Volunteer Work.txt", meta: "430 hours", icon: "text", view: { kind: "document", id: "volunteer" } },
    ],
  },
  interests: {
    title: "Interests",
    path: "/home/affan/Interests",
    items: [
      { id: "badminton", label: "Badminton.txt", meta: "Regional competitor", icon: "text", view: { kind: "document", id: "badminton" } },
      { id: "printing", label: "3D Printing.txt", meta: "Design and fabrication", icon: "text", view: { kind: "document", id: "3d-printing" } },
      { id: "reading", label: "Reading-list.txt", meta: "Current books", icon: "text", view: { kind: "document", id: "reading" } },
      { id: "photography", label: "Photography.url", meta: "VSCO gallery", icon: "link", view: { kind: "document", id: "photography" } },
      { id: "home-lab", label: "Home Lab.md", meta: "Proxmox project", icon: "code", view: { kind: "document", id: "home-lab" } },
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
      { id: "react-bits", label: "React Bits.url", meta: "Motion feedback reference", icon: "link", href: "https://reactbits.dev/get-started/introduction" },
      { id: "rachel", label: "Rachel Wei.url", meta: "Live room reference", icon: "link", href: "https://rachelqrwei.ca/use" },
      { id: "rachel-source", label: "Rachel Wei Source.url", meta: "Hitbox and hover reference", icon: "link", href: "https://github.com/rachelqrwei/personalwebsite" },
      { id: "perry", label: "Perry Wang.url", meta: "Editorial portfolio reference", icon: "link", href: "https://perryw-2023.webflow.io/" },
      { id: "three-js", label: "Three.js.url", meta: "3D rendering reference", icon: "link", href: "https://threejs.org/" },
      { id: "three-resources", label: "Three.js Resources.url", meta: "Model library directory", icon: "link", href: "https://threejsresources.com/category/models" },
      { id: "three-assets", label: "3D Assets Directory.url", meta: "Asset tool directory", icon: "link", href: "https://threejsresources.com/tool/3d-assets" },
      { id: "turbosquid", label: "TurboSquid Review.url", meta: "Free-model marketplace reviewed", icon: "link", href: "https://www.turbosquid.com/Search/3D-Models/furnishings?max_price=0" },
      { id: "poly-haven", label: "Poly Haven.url", meta: "CC0 PBR models", icon: "link", href: "https://polyhaven.com/" },
      { id: "studio-reference", label: "Studio Reference.url", meta: "Lighting and layout reference", icon: "link", href: "https://sketchfab.com/3d-models/project-793e99898ff14f2a89c73a3ccb5d7d10" },
    ],
  },
};

const learningLogMonths = Array.from(new Map(
  learningLogEntries.map((entry) => [`${entry.year}-${entry.month}`, { year: entry.year, month: entry.month, monthLabel: entry.monthLabel }]),
).values()).sort((a, b) => `${b.year}-${b.month}`.localeCompare(`${a.year}-${a.month}`));

const learningLogFolders = Object.fromEntries([
  ["learning-log", {
    title: "Learning Log",
    path: "/home/affan/Learning Log",
    items: [
      ...learningLogMonths.map((month) => ({
        id: `learning-log-${month.year}-${month.month}`,
        label: `${month.monthLabel} ${month.year}`,
        meta: `${learningLogEntries.filter((entry) => entry.year === month.year && entry.month === month.month).length} entries`,
        icon: "folder" as const,
        view: { kind: "folder" as const, id: `learning-log-${month.year}-${month.month}` as LearningLogFolderId },
      })),
      { id: "learning-log-repository", label: "Repository.url", meta: "Public source on GitHub", icon: "link" as const, href: "https://github.com/sil6428/learning-log" },
    ],
  }],
  ...learningLogMonths.map((month) => [`learning-log-${month.year}-${month.month}`, {
    title: `${month.monthLabel} ${month.year}`,
    path: `/home/affan/Learning Log/${month.year}/${month.monthLabel}`,
    items: learningLogEntries
      .filter((entry) => entry.year === month.year && entry.month === month.month)
      .map((entry) => ({
        id: entry.id,
        label: `${entry.date}.md`,
        meta: entry.title,
        icon: "code" as const,
        view: { kind: "document" as const, id: entry.id as LearningLogDocumentId },
      })),
  }]),
]) as Record<LearningLogFolderId, FolderContent>;

const folders = { ...baseFolders, ...learningLogFolders } as Record<FolderId, FolderContent>;

const baseDocuments: Record<StaticDocumentId, DocumentContent> = {
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
  cicids2017: {
    title: "CICIDS2017.research",
    type: "Research project · Cybersecurity dataset audit",
    intro: "A reproducible audit and split-sensitivity study of the CICIDS2017 intrusion-detection dataset. I cleaned and traced the public CSV data, reproduced a Random Forest baseline, and tested how the evaluation changes when source files are held out.",
    bullets: [
      "Audited 2,830,743 network-flow records and 79 columns across eight source files",
      "Removed 2,867 rows containing invalid values and retained 2,827,876 clean flows with 77 model features",
      "Measured 99.5721% mean random-split accuracy across three seeds on a deterministic 239,603-row sample",
      "Measured 20.7831% accuracy under leave-one-source-file-out evaluation, exposing a 78.7889 percentage-point split sensitivity",
      "Built 14 automated tests and published the full method, limitations, reports, and generated JSON evidence",
    ],
    links: [{ label: "View public research repository", href: "https://github.com/sil6428/cicids2017-reproduction" }],
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
    type: "Markdown document · Skills with applied examples",
    intro: "Tools and concepts I have used through university coursework, networking labs, personal software, client-facing work, and this portfolio. Each entry identifies where I applied the skill instead of listing it without context.",
    bullets: [
      "Networking · Configured IPv4 and IPv6 addressing, subnetting, VLANs, access ports, 802.1Q trunks, DHCP, DNS, NAT, STP, and inter-VLAN routing in Cisco IOS and Packet Tracer labs",
      "Troubleshooting · Used ping, traceroute, show commands, Wireshark, packet captures, routing tables, and interface state to isolate connectivity and configuration problems",
      "Cybersecurity · Applied authentication, authorization, role-based access control, encryption, hashing, vulnerability analysis, and privacy requirements while planning Archtech and completing security coursework",
      "Security data research · Audited 2,830,743 CICIDS2017 flows, built deterministic cleaning and sampling pipelines, reproduced Random Forest baselines, measured split sensitivity, and documented limitations through 14 automated tests",
      "Python · Built a command-line password manager with generation, validation, menus, input handling, and encrypted-storage fundamentals",
      "JavaScript and DOM · Built an event-planning tool that adds, edits, displays, and removes events while keeping the page state synchronized",
      "TypeScript and React · Built AFFAN_OS, the portfolio interface, reusable components, window state, keyboard interactions, and accessible controls",
      "Three.js · Built the interactive cyber lab, procedural room models, material systems, raycast selection, camera transitions, printer animation, and separate touch controls",
      "Next.js and CSS · Built responsive routes, project case studies, mobile layouts, metadata, custom illustrations, and the desktop-style file environment",
      "Cloudflare Workers · Built and repeatedly deployed the portfolio and Archtech demonstrations, then verified live Worker versions and public routes",
      "Git and GitHub · Managed staged project repositories, backup branches, documentation, version history, tests, and public portfolio source",
      "Linux and virtualization · Use Linux tools in coursework and personal systems work while converting older computers into a Proxmox home lab for virtual machines and isolated networks",
      "Web delivery · Independently designed and built the SSIK IT consulting website, organized its service content, and published it through GitHub Pages",
      "Systems tools · Worked with Windows Server, Cisco Packet Tracer, Wireshark, SecureCRT, and GitHub across labs and projects",
      "Communication and operations · Applied customer support, transaction accuracy, crowd flow, event coordination, conflict resolution, and team communication through paid and volunteer experience",
    ],
  },
  education: {
    title: "Ontario Tech.txt",
    type: "Education record",
    intro: "Bachelor of Information Technology in Networking and Cybersecurity at Ontario Tech University in Oshawa, Ontario. I started in September 2024 and expect to graduate in 2028.",
    bullets: [
      "Advanced Networking I",
      "Cybersecurity Fundamentals",
      "Programming I with Python",
      "Computer Systems",
      "Coursework combines network configuration, systems, security, and software fundamentals",
    ],
    links: [{ label: "Visit Ontario Tech", href: "https://ontariotechu.ca/" }],
  },
  certification: {
    title: "Security+.plan",
    type: "Certification plan · In progress",
    intro: "I am preparing for CompTIA Security+ with an expected completion target of September 2026.",
    bullets: [
      "Threats, vulnerabilities, and mitigations",
      "Security architecture and operations",
      "Identity, authentication, and access control",
      "Risk, governance, and incident-response fundamentals",
    ],
  },
  "work-experience": {
    title: "Work Experience.txt",
    type: "Employment record",
    intro: "My work experience combines customer service, transaction accuracy, communication, and responsibility in fast-moving environments.",
    bullets: [
      "Sales Associate · Oshawa, Ontario · May 2025 to present",
      "Assist customers, answer product questions, and create a positive shopping experience",
      "Process cash and card transactions accurately while supporting efficient checkout operations",
      "Restock merchandise, organize displays, and work with team members to maintain the sales floor",
      "Summer Day Camp Counsellor · Oshawa, Ontario · May 2023 to July 2023",
      "Led daily activities, maintained group safety, supported event planning for more than 100 attendees, communicated instructions, and resolved conflicts calmly",
    ],
  },
  volunteer: {
    title: "Volunteer Work.txt",
    type: "Community experience · 430 hours",
    intro: "I have completed more than 430 hours of community and event volunteer work in Oshawa.",
    bullets: [
      "Community Volunteer · Al Arqam Islamic Centre · 400 hours",
      "Supported registration, guest service, crowd flow, setup, cleanup, and attendee needs at large community events",
      "Event Organizer · YCC519 Community Event · 30 hours",
      "Coordinated event setup, logistics, front-line attendee assistance, and flow control",
    ],
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
  badminton: {
    title: "Badminton.txt",
    type: "Interest record · Regional competitor",
    intro: "I competed at the regional level in badminton. The sport taught me to make fast decisions, stay composed when a match changes, and improve through repetition.",
    bullets: ["Regional-level competition", "Footwork, timing, and controlled movement", "Match preparation and disciplined practice", "Learning from every rally instead of dwelling on the last point"],
  },
  "3d-printing": {
    title: "3D Printing.txt",
    type: "Design and fabrication notes",
    intro: "I enjoy turning digital models into physical objects and learning how orientation, supports, layer height, tolerances, and material affect a print.",
    bullets: ["Printed a katana inspired by Elden Ring", "Printed Leon's hand cannon from Red Dead Redemption", "Iterate on failed supports and weak overhangs", "Use the portfolio printer as an animated model of the real process"],
  },
  photography: {
    title: "Photography.url",
    type: "Photography profile",
    intro: "Photography gives me a reason to notice framing, light, repetition, texture, and the small details people usually pass by.",
    bullets: ["Street and everyday photography", "Architecture, shadows, reflections, and quiet scenes", "Editing and sequencing images into a consistent gallery"],
    links: [{ label: "Open VSCO gallery", href: "https://sy1len.vsco.site" }],
  },
  "home-lab": {
    title: "Home Lab.md",
    type: "Current technical project",
    intro: "I am repurposing older computers into a Proxmox server because I want a safe place to practise virtualization, networking, storage, and self-hosting.",
    bullets: ["Build isolated virtual networks", "Create and rebuild virtual machines", "Practise backups and service recovery", "Document changes before exposing any service", "Reuse older hardware instead of treating it as waste"],
  },
  resume: {
    title: "Resume.pdf",
    type: "PDF document",
    intro: "Affan Shaikh's current one-page IT resume.",
  },
  terminal: {
    title: "Terminal",
    type: "AFFAN_OS shell",
    intro: "AFFAN_OS interactive shell",
  },
};

const learningLogDocuments = Object.fromEntries(learningLogEntries.map((entry) => [entry.id, {
  title: entry.title,
  type: "Public learning log · Markdown",
  intro: `Published ${entry.date}. This complete entry is stored in the public learning-log repository and rendered locally inside AFFAN_OS.`,
  body: entry.body,
  publishedAt: entry.date,
}])) as Record<LearningLogDocumentId, DocumentContent>;

const documents = { ...baseDocuments, ...learningLogDocuments } as Record<DocumentId, DocumentContent>;

const desktopGroups: Array<{ id: string; label: string; items: OsItem[] }> = [
  {
    id: "folders",
    label: "Folders",
    items: [
      { id: "home", label: "Home", meta: "Personal files", icon: "folder", view: { kind: "folder", id: "home" } },
      { id: "projects", label: "Projects", meta: "Development work", icon: "folder", view: { kind: "folder", id: "projects" } },
      { id: "networking", label: "Network Labs", meta: "Lab notes", icon: "folder", view: { kind: "folder", id: "networking" } },
      { id: "interests", label: "Interests", meta: "Personal interests", icon: "folder", view: { kind: "folder", id: "interests" } },
      { id: "contact", label: "Contact", meta: "Public links", icon: "folder", view: { kind: "folder", id: "contact" } },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    items: [
      { id: "resume", label: "Resume.pdf", meta: "Resume", icon: "pdf", view: { kind: "document", id: "resume" } },
      { id: "about", label: "About.txt", meta: "Profile", icon: "text", view: { kind: "document", id: "about" } },
      { id: "skills", label: "Skills.md", meta: "Technical skills", icon: "code", view: { kind: "document", id: "skills" } },
      { id: "education", label: "Education", meta: "Degree and certification", icon: "folder", view: { kind: "folder", id: "education" } },
      { id: "experience", label: "Experience", meta: "Work and volunteer", icon: "folder", view: { kind: "folder", id: "experience" } },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { id: "terminal", label: "Terminal", meta: "AFFAN_OS shell", icon: "terminal", view: { kind: "document", id: "terminal" } },
      { id: "learning-log", label: "Learning Log", meta: `${learningLogEntries.length} public entries`, icon: "folder", view: { kind: "folder", id: "learning-log" } },
    ],
  },
];

const desktopItems = desktopGroups.flatMap((group) => group.items);
const iconOrder: Record<OsItem["icon"], number> = { folder: 0, pdf: 1, text: 2, code: 3, terminal: 4, link: 5 };

function FileIcon({ type }: { type: OsItem["icon"] }) {
  return <span className={`affan-os-icon affan-os-icon-${type}`} aria-hidden="true"><i /></span>;
}

function ExternalMark() {
  return <span className="affan-os-external" aria-hidden="true">↗</span>;
}

function renderInlineMarkdown(value: string): ReactNode[] {
  return value.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|<https?:\/\/[^>]+>)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    const markdownLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (markdownLink) return <a href={markdownLink[2]} target="_blank" rel="noreferrer" key={`${part}-${index}`}>{markdownLink[1]}<span className="sr-only"> (opens in a new tab)</span></a>;
    if (part.startsWith("<http") && part.endsWith(">")) {
      const href = part.slice(1, -1);
      return <a href={href} target="_blank" rel="noreferrer" key={`${part}-${index}`}>{href}<span className="sr-only"> (opens in a new tab)</span></a>;
    }
    return part;
  });
}

function LearningLogMarkdown({ body }: { body: string }) {
  return (
    <div className="affan-os-log-body">
      {body.split("\n").map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) return <span className="affan-os-log-space" aria-hidden="true" key={`space-${index}`} />;
        if (line.startsWith("### ")) return <h3 key={`h3-${index}`}>{renderInlineMarkdown(line.slice(4))}</h3>;
        if (line.startsWith("## ")) return <h2 key={`h2-${index}`}>{renderInlineMarkdown(line.slice(3))}</h2>;
        const checkbox = line.match(/^- \[([ xX])\]\s+(.*)$/);
        if (checkbox) return <p className="affan-os-log-check" key={`check-${index}`}><span aria-hidden="true">{checkbox[1].toLowerCase() === "x" ? "✓" : "○"}</span>{renderInlineMarkdown(checkbox[2])}</p>;
        if (line.startsWith("- ")) return <p className="affan-os-log-bullet" key={`bullet-${index}`}>{renderInlineMarkdown(line.slice(2))}</p>;
        return <p key={`paragraph-${index}`}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
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
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalCwd, setTerminalCwd] = useState<FolderId>("home");
  const [terminalCommandHistory, setTerminalCommandHistory] = useState<string[]>([]);
  const [terminalHistoryIndex, setTerminalHistoryIndex] = useState(-1);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "AFFAN_OS bash-compatible portfolio shell v3.0",
    "Connected to the portfolio room.",
    "Type help to list commands. Use cd, ls, cat, open, find, and grep to explore.",
  ]);
  const windowRef = useRef<HTMLElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (view && !minimized) windowRef.current?.focus();
  }, [view, minimized]);

  useEffect(() => {
    if (view?.kind === "document" && view.id === "terminal" && !minimized) {
      terminalInputRef.current?.focus();
    }
  }, [view, minimized]);

  useEffect(() => {
    const openOsTerminal = () => {
      setView({ kind: "document", id: "terminal" });
      setHistory([]);
      setMinimized(false);
      setLauncherOpen(false);
      setAnnouncement("Terminal opened with the backtick key");
    };
    window.addEventListener("affan-os-terminal-toggle", openOsTerminal);
    return () => window.removeEventListener("affan-os-terminal-toggle", openOsTerminal);
  }, []);

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
    { id: "inspiration", label: "Inspiration", meta: "References", icon: "folder" as const, view: { kind: "folder" as const, id: "inspiration" as const } },
  ], []);
  const launcherItems = allLauncherItems.filter((item) => `${item.label} ${item.meta}`.toLowerCase().includes(query.toLowerCase()));

  const activateItem = (item: OsItem) => {
    if (item.view) openView(item.view);
  };

  const shellPath = terminalCwd === "home" ? "~" : folders[terminalCwd].path.replace("/home/affan", "~");
  const shellPrompt = `affan@portfolio:${shellPath}$`;
  const normalizeShellTarget = (value: string) => value
    .trim()
    .toLowerCase()
    .replace(/^\.\//, "")
    .replace(/\.(txt|md|pdf|project|website|repo|py|js|plan|url|contact|private)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const resolveShellFolder = (value: string): FolderId | null => {
    const target = value.trim().replace(/\/$/, "");
    if (!target || target === ".") return terminalCwd;
    if (["/", "~", "/home", "/home/affan", "home", "files"].includes(target.toLowerCase())) return "home";
    if (target === "..") return "home";
    const aliases: Partial<Record<string, FolderId>> = {
      work: "projects", project: "projects", projects: "projects",
      lab: "networking", labs: "networking", network: "networking", networking: "networking",
      education: "education", experience: "experience", interest: "interests", interests: "interests",
      contact: "contact", inspiration: "inspiration", references: "inspiration",
      log: "learning-log", logs: "learning-log", learning: "learning-log", "learning-log": "learning-log",
    };
    const normalized = normalizeShellTarget(target.split("/").filter(Boolean).at(-1) ?? target);
    if (aliases[normalized]) return aliases[normalized] ?? null;
    const currentMatch = folders[terminalCwd].items.find((item) => item.view?.kind === "folder" && normalizeShellTarget(item.label) === normalized);
    return currentMatch?.view?.kind === "folder" ? currentMatch.view.id : null;
  };
  const findShellItem = (value: string): OsItem | null => {
    const normalized = normalizeShellTarget(value);
    if (!normalized) return null;
    const items = [...folders[terminalCwd].items, ...Object.values(folders).flatMap((folder) => folder.items), ...desktopItems];
    return items.find((item) => item.id === normalized || normalizeShellTarget(item.label) === normalized) ??
      items.find((item) => normalizeShellTarget(item.label).includes(normalized)) ?? null;
  };
  const shellCompletions = [
    "help", "pwd", "ls", "cd", "cat", "less", "open", "tree", "find", "grep", "history", "clear",
    "whoami", "date", "uname", "hostname", "id", "echo", "printf", "printenv", "man", "status",
    "lights", "relic", "signal", "print", "room", "exit", "shutdown", ...Object.keys(folders), ...Object.keys(documents),
  ];

  const submitTerminal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = terminalInput.trim();
    if (!command) return;
    const tokens = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map((token) => token.replace(/^["']|["']$/g, "")) ?? [];
    const verb = (tokens[0] ?? "").toLowerCase();
    const args = tokens.slice(1);
    const target = args.filter((argument) => !argument.startsWith("-")).join(" ");
    const normalized = command.toLowerCase().replace(/^open\s+/, "");
    const prompt = `${shellPrompt} ${command}`;
    setTerminalCommandHistory((current) => [...current, command]);
    setTerminalHistoryIndex(-1);
    const folderCommands: Partial<Record<string, FolderId>> = {
      files: "home",
      home: "home",
      projects: "projects",
      labs: "networking",
      networking: "networking",
      education: "education",
      experience: "experience",
      interests: "interests",
      contact: "contact",
      "learning-log": "learning-log",
      logs: "learning-log",
    };
    const documentCommands: Partial<Record<string, DocumentId>> = {
      resume: "resume",
      about: "about",
      skills: "skills",
    };
    const responses: Record<string, string[]> = {
      help: [
        "Bash navigation: pwd, ls [-la] [dir], cd <dir>, tree [dir], cat <file>, less <file>, open <file|dir|link>, find <term>, grep <term> <file>",
        "Shell tools: history, clear, whoami, date, uname, hostname, id, echo <text>, printenv, man <command>, status",
        "Room controls: lights, cat, relic, signal, print, room, shutdown",
        "Quote names containing spaces. Arrow keys recall history and Tab completes commands.",
      ],
      ls: ["Folders: Projects  Network Labs  Education  Experience  Interests  Contact  Inspiration  Learning Log", "Files: About.txt  Skills.md  Resume.pdf"],
      whoami: ["Affan Shaikh", "Networking and Cybersecurity student · Ontario Tech · Class of 2028"],
      status: ["AFFAN_OS online", "Current focus: portfolio systems, cybersecurity, networking, and a Proxmox home lab."],
      lights: ["Sending a colour override to the 3D room..."],
      cat: ["Sending three approved pets to the room cat..."],
      relic: ["Charging the printed katana on the bottom shelf..."],
      signal: ["Starting the hidden server beacon sequence..."],
      print: ["The miniature chess set takes exactly 03:00.", "Watch the printer display for live progress."],
    };

    const appendOutput = (...output: string[]) => setTerminalLines((lines) => [...lines, prompt, ...output]);
    if (verb === "exit") {
      setTerminalInput("");
      closeWindow();
      return;
    }
    if (["shutdown", "poweroff"].includes(verb)) {
      appendOutput("Shutting down AFFAN_OS and returning to the 3D room...");
      setTerminalInput("");
      window.setTimeout(onExit, 180);
      return;
    }
    if (verb === "cd") {
      const nextFolder = resolveShellFolder(target || "~");
      if (!nextFolder) appendOutput(`bash: cd: ${target}: No such directory`);
      else {
        setTerminalCwd(nextFolder);
        appendOutput(folders[nextFolder].path);
      }
      setTerminalInput("");
      return;
    }
    if (verb === "pwd") {
      appendOutput(folders[terminalCwd].path);
      setTerminalInput("");
      return;
    }
    if (verb === "ls" || verb === "dir") {
      const selectedFolder = resolveShellFolder(target || ".");
      if (!selectedFolder) appendOutput(`ls: cannot access '${target}': No such directory`);
      else appendOutput(...folders[selectedFolder].items.map((item) => `${item.view?.kind === "folder" ? "d" : "-"}r--r--r--  affan  ${item.label}${item.view?.kind === "folder" ? "/" : ""}`));
      setTerminalInput("");
      return;
    }
    if (verb === "tree") {
      const selectedFolder = resolveShellFolder(target || ".");
      if (!selectedFolder) appendOutput(`tree: ${target}: No such directory`);
      else appendOutput(folders[selectedFolder].title, ...folders[selectedFolder].items.map((item, index, items) => `${index === items.length - 1 ? "└──" : "├──"} ${item.label}${item.view?.kind === "folder" ? "/" : ""}`));
      setTerminalInput("");
      return;
    }
    if (["open", "xdg-open", "visit"].includes(verb)) {
      const folderTarget = resolveShellFolder(target);
      const item = findShellItem(target);
      if (["room", "site", "website"].includes(target.toLowerCase())) {
        appendOutput("Returning to the interactive room...");
        window.setTimeout(onExit, 180);
      } else if (folderTarget) {
        appendOutput(`Opening ${folders[folderTarget].title}...`);
        window.setTimeout(() => openView({ kind: "folder", id: folderTarget }), 120);
      } else if (item?.view) {
        appendOutput(`Opening ${item.label}...`);
        window.setTimeout(() => openView(item.view as OsView), 120);
      } else if (item?.href) {
        appendOutput(`Opening ${item.label} in a new tab...`);
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else appendOutput(`bash: open: ${target || "missing operand"}: No such file or directory`);
      setTerminalInput("");
      return;
    }
    if ((verb === "cat" && Boolean(target)) || verb === "less") {
      const item = findShellItem(target);
      if (item?.view?.kind !== "document") appendOutput(`cat: ${target || "missing operand"}: No such text file`);
      else {
        const document = documents[item.view.id];
        appendOutput(`# ${document.title}`, document.intro, ...(document.bullets ?? []).map((line) => `- ${line}`), ...(document.body?.split("\n") ?? []));
      }
      setTerminalInput("");
      return;
    }
    if (verb === "find") {
      const needle = normalizeShellTarget(target);
      const matches = Object.values(folders).flatMap((folder) => folder.items).filter((item) => !needle || normalizeShellTarget(`${item.label}-${item.meta}`).includes(needle));
      appendOutput(...(matches.length ? matches.map((item) => `${item.view?.kind === "folder" ? "./" : ""}${item.label}`) : [`find: no files matched '${target}'`]));
      setTerminalInput("");
      return;
    }
    if (verb === "grep") {
      const [pattern = "", ...fileParts] = args;
      const item = findShellItem(fileParts.join(" "));
      if (!pattern || item?.view?.kind !== "document") appendOutput("usage: grep <pattern> <file>");
      else {
        const document = documents[item.view.id];
        const matches = [document.intro, ...(document.bullets ?? []), ...(document.body?.split("\n") ?? [])].filter((line) => line.toLowerCase().includes(pattern.toLowerCase()));
        appendOutput(...(matches.length ? matches : [`grep: no matches for '${pattern}' in ${item.label}`]));
      }
      setTerminalInput("");
      return;
    }
    if (verb === "history") {
      appendOutput(...terminalCommandHistory.map((line, index) => `${String(index + 1).padStart(3, " ")}  ${line}`));
      setTerminalInput("");
      return;
    }
    if (verb === "echo" || verb === "printf") {
      appendOutput(args.join(" "));
      setTerminalInput("");
      return;
    }
    if (verb === "date") responses.date = [new Date().toString()];
    if (verb === "uname") responses.uname = ["AFFAN_OS portfolio 3.0 web x86_64 JavaScript/Three.js"];
    if (verb === "hostname") responses.hostname = ["portfolio"];
    if (verb === "id") responses.id = ["uid=1000(affan) gid=1000(portfolio) groups=projects,networking,cybersecurity"];
    if (verb === "printenv") responses.printenv = ["HOME=/home/affan", `PWD=${folders[terminalCwd].path}`, "SHELL=/bin/affan-bash", "PORTFOLIO_MODE=interactive"];
    if (verb === "man") {
      appendOutput(`AFFAN_OS manual: ${target || "help"}`, "This is a read-only portfolio filesystem. Use help for the complete command map.");
      setTerminalInput("");
      return;
    }

    if (normalized === "clear") {
      setTerminalLines([]);
      setTerminalInput("");
      return;
    }
    if (normalized === "room") {
      setTerminalLines((lines) => [...lines, prompt, "Returning to the 3D room..."]);
      setTerminalInput("");
      window.setTimeout(onExit, 180);
      return;
    }
    if (folderCommands[normalized]) {
      setTerminalLines((lines) => [...lines, prompt, `Opening ${folders[folderCommands[normalized]].title}...`]);
      setTerminalInput("");
      window.setTimeout(() => openView({ kind: "folder", id: folderCommands[normalized] as FolderId }), 120);
      return;
    }
    if (documentCommands[normalized]) {
      setTerminalLines((lines) => [...lines, prompt, `Opening ${documents[documentCommands[normalized]].title}...`]);
      setTerminalInput("");
      window.setTimeout(() => openView({ kind: "document", id: documentCommands[normalized] as DocumentId }), 120);
      return;
    }
    if (["lights", "cat", "relic", "signal"].includes(normalized)) {
      const roomEvent = normalized === "lights" ? "affan-room-palette" : `affan-room-${normalized}`;
      window.dispatchEvent(new Event(roomEvent));
    }
    const output = responses[normalized] ?? [`Command not found: ${normalized}`, "Type help to list AFFAN_OS commands."];
    setTerminalLines((lines) => [...lines, prompt, ...output]);
    setTerminalInput("");
  };

  const handleTerminalInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!terminalCommandHistory.length) return;
      const nextIndex = terminalHistoryIndex < 0 ? terminalCommandHistory.length - 1 : Math.max(0, terminalHistoryIndex - 1);
      setTerminalHistoryIndex(nextIndex);
      setTerminalInput(terminalCommandHistory[nextIndex]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (terminalHistoryIndex < 0) return;
      const nextIndex = terminalHistoryIndex + 1;
      if (nextIndex >= terminalCommandHistory.length) {
        setTerminalHistoryIndex(-1);
        setTerminalInput("");
      } else {
        setTerminalHistoryIndex(nextIndex);
        setTerminalInput(terminalCommandHistory[nextIndex]);
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const parts = terminalInput.split(/\s+/);
      const partial = parts.at(-1)?.toLowerCase() ?? "";
      const matches = shellCompletions.filter((candidate) => candidate.startsWith(partial));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setTerminalInput(parts.join(" "));
      }
    }
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
  const sortedFolderItems = activeFolder ? [...activeFolder.items].sort((a, b) => iconOrder[a.icon] - iconOrder[b.icon] || a.label.localeCompare(b.label)) : [];

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
        <div className="affan-os-desktop-groups">
          {desktopGroups.map((group) => (
            <section className={`affan-os-desktop-group is-${group.id}`} aria-labelledby={`desktop-${group.id}`} key={group.id}>
              <h2 id={`desktop-${group.id}`}>{group.label}</h2>
              <div className="affan-os-desktop-grid">
                {group.items.map((item) => item.href ? (
                  <a className="affan-os-desktop-item" href={item.href} target="_blank" rel="noreferrer" key={item.id}>
                    <FileIcon type={item.icon} /><span>{item.label}</span>
                  </a>
                ) : (
                  <button className="affan-os-desktop-item" type="button" onClick={() => activateItem(item)} key={item.id}>
                    <FileIcon type={item.icon} /><span>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
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
                  {(["home", "projects", "networking", "education", "experience", "interests", "learning-log", "contact"] as FolderId[]).map((folderId) => (
                    <button className={view.id === folderId ? "is-current" : ""} type="button" onClick={() => openView({ kind: "folder", id: folderId })} key={folderId}>{folders[folderId].title}</button>
                  ))}
                </aside>
                <div className="affan-os-file-grid" aria-label={`${activeFolder.title} contents`}>
                  {sortedFolderItems.map((item) => item.href ? (
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

          {activeDocument && view.kind === "document" && view.id === "resume" && (
            <div className="affan-os-resume-viewer">
              <nav aria-label="Resume controls">
                <div><strong>Affan_Shaikh_Resume.pdf</strong><span>1 page</span></div>
                <a href="/Affan_Shaikh_Resume.pdf" target="_blank" rel="noreferrer">Open full size <ExternalMark /></a>
                <a href="/Affan_Shaikh_Resume.pdf" download>Download PDF</a>
              </nav>
              <iframe src="/Affan_Shaikh_Resume.pdf#view=FitH&toolbar=0" title="Affan Shaikh resume PDF" />
            </div>
          )}

          {activeDocument && view.kind === "document" && view.id === "terminal" && (
            <div className="affan-os-terminal">
              <div className="affan-os-terminal-history" aria-live="polite">
                {terminalLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
              </div>
              <form onSubmit={submitTerminal}>
                <label htmlFor="affan-os-terminal-input">{shellPrompt}</label>
                <input
                  id="affan-os-terminal-input"
                  ref={terminalInputRef}
                  value={terminalInput}
                  onChange={(event) => setTerminalInput(event.target.value)}
                  onKeyDown={handleTerminalInputKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="affan-os-terminal-help"
                />
              </form>
              <p id="affan-os-terminal-help">Use Bash-style commands to navigate the portfolio. Arrow keys recall history and Tab completes commands.</p>
            </div>
          )}

          {activeDocument && view.kind === "document" && view.id !== "terminal" && view.id !== "resume" && (
            <div className="affan-os-document">
              <div className="affan-os-document-meta"><span>{activeDocument.type}</span><span>Read only</span></div>
              <h1>{activeDocument.title}</h1>
              <p className="affan-os-document-intro">{activeDocument.intro}</p>
              {activeDocument.body && <LearningLogMarkdown body={activeDocument.body} />}
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
