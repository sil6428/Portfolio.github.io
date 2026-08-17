import type { Metadata } from "next";
import CaseStudy from "../case-study";

export const metadata: Metadata = {
  title: "Archtech Nonprofit Technology Operations | Affan Shaikh",
  description: "Google Workspace setup, team coordination, and website hosting for a developing nonprofit.",
};

const data = {
  index: "01",
  title: "Archtech Nonprofit Technology Operations",
  label: "Nonprofit infrastructure · Active",
  summary:
    "I set up Google Workspace for a developing nonprofit, coordinate the team building its website, and own the website hosting and deployment workflow.",
  facts: [
    ["Role", "Google Workspace and web hosting"],
    ["Status", "Active, private development"],
    ["Team", "Website team coordination"],
    ["Repository", "Private"],
    ["Focus", "Collaboration, hosting, reliable releases"],
  ] as Array<[string, string]>,
  links: [],
  sections: [
    {
      title: "Google Workspace foundation",
      paragraphs: [
        "I set up the nonprofit's Google Workspace environment so the organization has a structured foundation for accounts, communication, and team collaboration.",
        "This infrastructure work is my main focus. I treat access, ownership, and continuity as operational requirements instead of afterthoughts.",
      ],
    },
    {
      title: "Team and website",
      paragraphs: [
        "I coordinate the team currently building the organization's full website. I contribute to the implementation alongside them, but my development role is smaller than my Workspace and hosting responsibilities.",
      ],
      bullets: [
        "Coordinate website work across the team",
        "Support implementation where needed",
        "Keep infrastructure and delivery responsibilities clear",
      ],
    },
    {
      title: "Hosting responsibility",
      paragraphs: [
        "I own the website hosting and deployment workflow. My role is to help the team's work reach a stable environment and keep releases organized as the site develops.",
      ],
      bullets: [
        "Prepare and maintain the hosting environment",
        "Coordinate deployments with the website team",
        "Verify releases and troubleshoot hosting issues",
      ],
    },
    {
      title: "Private development",
      paragraphs: [
        "The website source and internal project material remain private while the nonprofit is still developing. This portfolio describes my responsibilities without exposing the repository or unfinished internal work.",
      ],
    },
  ],
};

export default function ArchtechCaseStudy() {
  return <CaseStudy data={data} />;
}
