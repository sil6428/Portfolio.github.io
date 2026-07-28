import type { Metadata } from "next";
import InterestDetail from "../interest-detail";
import { readingData } from "../interest-data";

export const metadata: Metadata = {
  title: "Reading | Affan Shaikh",
  description: "The web novels, manhwa, and manga Affan Shaikh is currently reading.",
};

export default function ReadingPage() {
  return <InterestDetail data={readingData} />;
}
