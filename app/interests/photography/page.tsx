import type { Metadata } from "next";
import InterestDetail from "../interest-detail";
import { photographyData } from "../interest-data";

export const metadata: Metadata = {
  title: "Photography | Affan Shaikh",
  description: "Affan Shaikh's photography interests and VSCO gallery.",
};

export default function PhotographyPage() {
  return <InterestDetail data={photographyData} />;
}
