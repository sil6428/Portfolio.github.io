import type { Metadata } from "next";
import InterestDetail from "../interest-detail";
import { badmintonData } from "../interest-data";

export const metadata: Metadata = {
  title: "Badminton | Affan Shaikh",
  description: "Affan Shaikh's experience competing in badminton at the regional level.",
};

export default function BadmintonPage() {
  return <InterestDetail data={badmintonData} />;
}
