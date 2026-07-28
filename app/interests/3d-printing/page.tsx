import type { Metadata } from "next";
import InterestDetail from "../interest-detail";
import { printingData } from "../interest-data";

export const metadata: Metadata = {
  title: "3D Printing & Design | Affan Shaikh",
  description: "3D printing, prop design, assembly, and finishing projects by Affan Shaikh.",
};

export default function PrintingPage() {
  return <InterestDetail data={printingData} />;
}
