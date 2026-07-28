import type { Metadata } from "next";
import InterestDetail from "../interest-detail";
import { homeLabData } from "../interest-data";

export const metadata: Metadata = {
  title: "Proxmox Home Lab | Affan Shaikh",
  description: "Affan Shaikh's Proxmox virtualization and networking home lab.",
};

export default function HomeLabPage() {
  return <InterestDetail data={homeLabData} />;
}
