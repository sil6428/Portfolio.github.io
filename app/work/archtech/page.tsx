import type { Metadata } from "next";
import CaseStudy from "../case-study";

export const metadata: Metadata = {
  title: "Archtech Case Study | Affan Shaikh",
  description: "A work-in-progress privacy-focused community platform built by Affan Shaikh.",
};

const data = {
  index: "01",
  title: "Archtech",
  label: "Private build · Work in progress",
  summary:
    "A privacy-focused community platform built around stories, secure connection, publishing, moderation, and community programs.",
  image: "/projects/archtech-home.png",
  imageAlt: "Archtech public homepage with editorial cards for listening, connecting, and creating",
  facts: [
    ["Role", "Design and development"],
    ["Status", "Active, unreleased"],
    ["Release", "Stage 4.5"],
    ["Stack", "Next.js, TypeScript, Workers, D1, KV"],
    ["Focus", "Privacy, community, access control"],
  ] as Array<[string, string]>,
  links: [
    {
      label: "View public demo",
      href: "https://sil6428-archtech-stage-4-5.sil6428-archtech.workers.dev/",
    },
  ],
  sections: [
    {
      title: "Why I started it",
      paragraphs: [
        "Archtech began as an attempt to build a community space where people could share stories and connect without treating privacy as an afterthought. It is still a work in progress and has not been released.",
        "I use the project to learn how product design, application security, moderation, and infrastructure decisions affect one another.",
      ],
    },
    {
      title: "What I built",
      paragraphs: [
        "The current build is a multi-page platform with public storytelling, community information, and a protected connection area. I developed it through cumulative stages so every release kept the work from the previous one.",
      ],
      bullets: [
        "Public pages for stories, programs, events, and participation",
        "A protected messaging route with role-aware access",
        "Publishing and moderation workflows",
        "Cloudflare deployment using Workers, D1, and KV",
        "Responsive navigation and accessible interaction states",
      ],
    },
    {
      title: "Decisions and challenges",
      paragraphs: [
        "The hardest part has been making privacy and authorization visible in the product instead of hiding them behind technical language. Protected routes need clear boundaries, and community tools need to explain who sees each action.",
        "Moving from a single-page concept to a routed application also forced me to think about deployment, durable data, navigation, and responsive behavior as one system.",
      ],
    },
    {
      title: "What comes next",
      paragraphs: [
        "The next stages focus on stronger authentication, durable messaging, clearer moderation tools, and more complete settings. I am also documenting threat assumptions and testing access-control paths before any public release.",
      ],
    },
  ],
  nextSlug: "/work/ssik",
  nextTitle: "SSIK Website",
};

export default function ArchtechCaseStudy() {
  return <CaseStudy data={data} />;
}
