import type { Metadata } from "next";
import CaseStudy from "../case-study";

export const metadata: Metadata = {
  title: "SSIK Website Case Study | Affan Shaikh",
  description: "The public website for SSIK IT Consulting & Solutions.",
};

const data = {
  index: "04",
  title: "SSIK Website",
  label: "IT consulting business · Public website",
  summary:
    "I independently designed and built the public website for our IT consulting team. It presents SSIK's services and helps prospective clients understand what we offer.",
  image: "/projects/ssik-home.png",
  imageAlt: "SSIK IT Consulting and Solutions homepage describing secure IT services for modern businesses",
  facts: [
    ["Role", "Consulting team member and sole site creator"],
    ["Status", "Public"],
    ["Type", "Business website"],
    ["Hosting", "GitHub Pages"],
    ["Focus", "Presenting our consulting services"],
  ] as Array<[string, string]>,
  links: [
    {
      label: "View live site",
      href: "https://sil6428.github.io/SSIK-website/index.html",
    },
    {
      label: "View source",
      href: "https://github.com/sil6428/SSIK-website",
    },
  ],
  sections: [
    {
      title: "The goal",
      paragraphs: [
        "The SSIK website acts as the public overview of our IT consulting work. It explains the services our team provides and gives prospective clients a clear starting point before a consultation.",
      ],
    },
    {
      title: "My role",
      paragraphs: [
        "I am part of the SSIK consulting team, and I independently created the entire public website. I handled its structure, visual design, service presentation, responsive layout, and deployment.",
        "The finished site supports our consulting work by organizing the offer into clear service areas and showing how the team helps businesses with security, infrastructure, risk, and IT planning.",
      ],
      bullets: [
        "Complete website design and development",
        "Service structure, copy presentation, and calls to action",
        "Cybersecurity audits and security reviews",
        "Penetration testing and risk assessment",
        "Infrastructure guidance and troubleshooting",
        "Responsive public deployment through GitHub Pages",
      ],
    },
    {
      title: "What I learned",
      paragraphs: [
        "Building the site alone required me to connect design, development, writing, and deployment. I had to decide what prospective clients needed to know, then turn those decisions into a complete public experience.",
        "My consulting role also shows me how technical knowledge, client needs, and business decisions connect.",
      ],
    },
    {
      title: "What comes next",
      paragraphs: [
        "Future work includes more detailed service pages, consulting case studies, and a clearer intake flow for prospective clients.",
      ],
    },
  ],
  nextSlug: "/work/archtech",
  nextTitle: "Archtech",
};

export default function SsikCaseStudy() {
  return <CaseStudy data={data} />;
}
